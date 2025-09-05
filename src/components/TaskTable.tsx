import React, { useEffect, useMemo, useState } from "react";
import type { Task } from "../types";
import { useUsers } from "../context/UserProvider";
import ProfileCircle from "./ProfileCircle";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

const TaskTable: React.FC<{ data: Task[], setTask: (value: Task) => void }> = ({ data, setTask }) => {
    const { users } = useUsers();
    const [globalFilter, setGlobalFilter] = useState("");
    const [groupBy, setGroupBy] = useState<"none" | "priority" | "status">("none");
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
    const [showUnseen, setShowUnseen] = useState(false);

    // Filter tasks by search and unseen
    const filteredTasks = useMemo(() => {
        let tasks = data;

        if (showUnseen) {
            tasks = tasks.filter((task) => task.status.toLowerCase() === "unseen");
        }

        if (globalFilter) {
            tasks = tasks.filter(
                (task) =>
                    task.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
                    task.status.toLowerCase().includes(globalFilter.toLowerCase()) ||
                    task.priority.toLowerCase().includes(globalFilter.toLowerCase())
            );
        }

        return tasks;
    }, [data, globalFilter, showUnseen]);

    // Group tasks
    const groupedData = useMemo(() => {
        if (groupBy === "none") return { all: filteredTasks };
        const groups: Record<string, Task[]> = {};
        filteredTasks.forEach((task) => {
            const key = task[groupBy];
            if (!groups[key]) groups[key] = [];
            groups[key].push(task);
        });
        return groups;
    }, [groupBy, filteredTasks]);

    useEffect(() => {
        console.log(data);
    }, [])


    return (
        <div className="p-4 w-full">
            {/* Search & Group Buttons */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full md:w-1/2"
                />

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setGroupBy("none")}
                        className={`px-4 py-2 rounded ${groupBy === "none" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        All Task
                    </button>
                    <button
                        onClick={() => setGroupBy("priority")}
                        className={`px-4 py-2 rounded ${groupBy === "priority" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        Group by Priority
                    </button>
                    <button
                        onClick={() => setGroupBy("status")}
                        className={`px-4 py-2 rounded ${groupBy === "status" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        Group by Status
                    </button>
                    <button
                        onClick={() => setShowUnseen((prev) => !prev)}
                        className={`px-4 py-2 rounded ${showUnseen ? "bg-purple-500 text-white" : "bg-gray-200"}`}
                    >
                        {showUnseen ? "Show All" : "Unseen Tasks"}
                    </button>
                </div>
            </div>

            {/* Render grouped tables */}
            {Object.entries(groupedData).map(([groupName, tasks]) => (
                <div key={groupName} className="mb-6 border rounded-lg shadow">
                    {/* Header with collapse */}
                    <div
                        className="flex justify-between items-center rounded-lg bg-gray-100 px-4 py-2 cursor-pointer"
                        onClick={() =>
                            setCollapsedGroups((prev) => ({
                                ...prev,
                                [groupName]: !prev[groupName],
                            }))
                        }
                    >
                        <h2 className="font-semibold text-lg">
                            {groupBy !== "none" ? `${groupBy.toUpperCase()}: ${groupName}` : "All Data"}
                        </h2>
                        <button className="flex items-center justify-center text-black rounded-full w-7 h-7 hover:text-gray-500 border">
                            {collapsedGroups[groupName] ? <AiOutlineDown /> : <AiOutlineUp />}
                        </button>
                    </div>

                    {!collapsedGroups[groupName] && (
                        <table className="min-w-full border-t border-gray-300 select-none">
                            <thead className="bg-gray-50 rounded">
                                <tr>
                                    <th className="px-4 py-2 text-left border-b">ID</th>
                                    <th className="px-4 py-2 text-left border-b">Title</th>
                                    <th className="px-4 py-2 text-left border-b">Employee</th>
                                    <th className="px-4 py-2 text-left border-b">Status</th>
                                    <th className="px-4 py-2 text-left border-b">Priority</th>
                                    <th className="px-4 py-2 text-left border-b">Start Date</th>
                                    <th className="px-4 py-2 text-left border-b">End Date</th>
                                    <th className="px-4 py-2 text-left border-b">Project</th>
                                    <th className="px-4 py-2 text-left border-b">Reschedule</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr
                                        key={task.id}
                                        className="hover:bg-gray-100 hover:rounded-lg"
                                        onClick={() => setTask(task)}
                                    >
                                        <td className="px-4 py-2 border-t">{task.id}</td>
                                        <td className="px-4 py-2 border-t">{task.title}</td>
                                        <td className="px-4 py-2 border-t">
                                            <div className="group relative">
                                                <span className="absolute z-10 hidden group-hover:block bg-white whitespace-nowrap p-0.5 rounded shadow-lg">
                                                    {users.find((u) => u.id === task.assignedTo)?.name}
                                                </span>
                                                <ProfileCircle
                                                    name={users.find((u) => u.id === task.assignedTo)?.name || ""}
                                                    colorHex={users.find((u) => u.id === task.assignedTo)?.colorHex || ""}
                                                    size={40}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 border-t">
                                            <span
                                                className={`px-2 py-1 rounded-full text-white ${task.status === "done"
                                                    ? "bg-green-500"
                                                    : task.status === "in-progress"
                                                        ? "bg-blue-500"
                                                        : task.status === "reschedule"
                                                            ? "bg-gray-400"
                                                            : task.status === "unseen"
                                                                ? "bg-purple-500"
                                                                : "bg-amber-700"
                                                    }`}
                                            >
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 border-t">
                                            <span
                                                className={`px-2 py-1 rounded-full ${task.priority === "high"
                                                    ? "bg-red-500 text-white"
                                                    : task.priority === "medium"
                                                        ? "bg-yellow-400 text-white"
                                                        : "bg-green-400 text-white"
                                                    }`}
                                            >
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 border-t font-mono text-sm">{task.startDate}</td>
                                        <td className="px-4 py-2 border-t font-mono text-sm">{task.endDate}</td>
                                        <td className="px-4 py-2 border-t">{task.projectId}</td>
                                        <td className="px-4 py-2 border-t border-black text-gray-400">Pending</td>
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
