import React, { useMemo, useState } from "react";
import type { Task } from "../types";
import { useUsers } from "../context/UserProvider";
import ProfileCircle from "./ProfileCircle";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { useTasks } from "../context/TaskContext";

type SortConfig = {
    key: keyof Task;
    direction: "asc" | "desc";
};
const columns: { key: keyof Task | "assignedTo"; label: string; className?: string }[] = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "assignedTo", label: "Employee" },
    { key: "status", label: "Status" },
    { key: "priority", label: "Priority" },
    { key: "startDate", label: "Start Date", className: "hidden sm:table-cell font-mono text-xs" },
    { key: "endDate", label: "End Date", className: "hidden sm:table-cell font-mono text-xs" },
    { key: "projectId", label: "Project", className: "hidden md:table-cell" },
    { key: "created_at", label: "Created At", className: "hidden md:table-cell" },
];


const TaskTable = () => {
    const { users } = useUsers();
    const { tasks, setSelectedTaskFn } = useTasks();
    const data = tasks;
    const [globalFilter, setGlobalFilter] = useState("");
    const [groupBy, setGroupBy] = useState<"none" | "priority" | "status">("none");
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
    const [showUnseen, setShowUnseen] = useState(false);
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const filteredTasks = useMemo(() => {
        let tasks = data;
        if (showUnseen) tasks = tasks.filter(t => t.status.toLowerCase() === "unseen");
        if (globalFilter) {
            tasks = tasks.filter(
                t =>
                    t.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
                    t.status.toLowerCase().includes(globalFilter.toLowerCase()) ||
                    t.priority.toLowerCase().includes(globalFilter.toLowerCase())
            );
        }
        return tasks;
    }, [data, globalFilter, showUnseen]);

    // Sort tasks
    const sortedTasks = useMemo(() => {
        if (!sortConfig) return filteredTasks;
        return [...filteredTasks].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
            }

            return sortConfig.direction === "asc"
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue));
        });
    }, [filteredTasks, sortConfig]);

    const groupedData = useMemo(() => {
        if (groupBy === "none") return { all: sortedTasks };
        const groups: Record<string, Task[]> = {};
        sortedTasks.forEach(task => {
            const key = task[groupBy];
            if (!groups[key]) groups[key] = [];
            groups[key].push(task);
        });
        return groups;
    }, [groupBy, sortedTasks]);

    const handleSort = (key: keyof Task) => {
        setSortConfig(prev => {
            if (prev?.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "asc" };
        });
    };

    return (
        <div className="p-2 sm:p-4 w-full">
            {/* Search & Group Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full sm:w-1/2 text-sm sm:text-base"
                />
                <div className="flex flex-wrap gap-2">
                    {["none", "priority", "status"].map((g) => (
                        <button
                            key={g}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onClick={() => setGroupBy(g as any)}
                            className={`px-2 sm:px-4 py-1 sm:py-2 rounded ${groupBy === g ? "bg-blue-500 text-white" : "bg-gray-200 text-sm sm:text-base"}`}
                        >
                            {g === "none" ? "All Tasks" : `Group by ${g.charAt(0).toUpperCase() + g.slice(1)}`}
                        </button>
                    ))}
                    <button
                        onClick={() => setShowUnseen(prev => !prev)}
                        className={`px-2 sm:px-4 py-1 sm:py-2 rounded ${showUnseen ? "bg-purple-500 text-white" : "bg-gray-200 text-sm sm:text-base"}`}
                    >
                        {showUnseen ? "Show All" : "Unseen Tasks"}
                    </button>
                </div>
            </div>

            {/* Grouped Tables */}
            {Object.entries(groupedData).map(([groupName, tasks]) => (
                <div key={groupName} className="mb-6 border rounded-lg shadow overflow-x-auto">
                    {/* Header */}
                    <div
                        className="flex justify-between items-center rounded-t-lg bg-gray-100 px-4 py-2 cursor-pointer"
                        onClick={() =>
                            setCollapsedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }))
                        }
                    >
                        <h2 className="font-semibold text-base sm:text-lg">
                            {groupBy !== "none" ? `${groupBy.toUpperCase()}: ${groupName}` : "All Data"}
                        </h2>
                        <button className="flex items-center justify-center text-black rounded-full w-7 h-7 hover:text-gray-500 border">
                            {collapsedGroups[groupName] ? <AiOutlineDown /> : <AiOutlineUp />}
                        </button>
                    </div>

                    {!collapsedGroups[groupName] && (
                        <table className="min-w-full border-t border-gray-300 select-none text-xs sm:text-lg">
                            <thead className="bg-gray-50">
                                <tr>
                                    {columns.map(col => (
                                        <th
                                            key={col.key}
                                            className={`px-2 sm:px-4 py-2 text-left border-b cursor-pointer ${col.className || ""}`}
                                            onClick={() => handleSort(col.key as keyof Task)}
                                        >
                                            <div className="flex items-center gap-1">
                                                {col.label}
                                                {sortConfig?.key === col.key && (sortConfig.direction === "asc" ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />)}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {tasks.map(task => (
                                    <tr
                                        key={task.id}
                                        className="hover:bg-gray-100 hover:rounded-lg"
                                        onClick={() => { setSelectedTaskFn(task); console.log(task); }}
                                    >
                                        <td className="px-2 sm:px-4 py-2 border-t">{task.id}</td>
                                        <td className="px-2 sm:px-4 py-2 border-t">{task.title}</td>
                                        <td className="px-2 sm:px-4 py-2 border-t">
                                            <div className="group relative">
                                                <span className="absolute z-10 hidden group-hover:block bg-white whitespace-nowrap p-0.5 rounded shadow-lg text-sm">
                                                    {users.find(u => Number(u.id) === Number(task.assignedTo))?.name}
                                                </span>
                                                <ProfileCircle
                                                    name={users.find(u => Number(u.id) === Number(task.assignedTo))?.name || ""}
                                                    colorHex={users.find(u => Number(u.id) === Number(task.assignedTo))?.colorHex || ""}
                                                    size={40}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 border-t">
                                            <span className={`px-2 py-1 rounded-full text-xs capitalize sm:text-base ${task.status === "done" ?
                                                "bg-emerald-100 text-emerald-700" : task.status === "in-progress" ?
                                                    "bg-yellow-100 text-yellow-700" : task.status === "reschedule" ?
                                                        "bg-purple-200 text-purple-700" : task.status === "unseen" ?
                                                            "bg-gray-200 text-gray-700" : "bg-blue-200 text-blue-700"}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 border-t">
                                            <span className={`px-2 py-1 rounded-full capitalize text-xs sm:text-base ${task.priority === "high" ?
                                                "bg-red-200 text-red-700" : task.priority === "medium" ?
                                                    "bg-orange-200 text-orange-700" : "bg-teal-200 text-teal-700"}`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 border-t hidden sm:table-cell font-mono text-xs">{task.startDate}</td>
                                        <td className="px-2 sm:px-4 py-2 border-t hidden sm:table-cell font-mono text-xs">{task.endDate}</td>
                                        <td className="px-2 sm:px-4 py-2 border-t hidden md:table-cell">{task.projectId}</td>
                                        <td className="px-2 sm:px-4 py-2 border-t hidden md:table-cell text-gray-400">{task.created_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TaskTable;
