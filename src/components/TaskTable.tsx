
import React, { useMemo, useState } from "react";
import type { Task } from "../types";

const TaskTable: React.FC<{ data: Task[] }> = ({ data }) => {
    const [globalFilter, setGlobalFilter] = useState("");
    const [groupBy, setGroupBy] = useState<"none" | "priority" | "status">(
        "none"
    );
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

    // Filter tasks by search
    const filteredTasks = useMemo(() => {
        if (!globalFilter) return data;
        return data.filter(
            (task) =>
                task.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
                task.status.toLowerCase().includes(globalFilter.toLowerCase()) ||
                task.priority.toLowerCase().includes(globalFilter.toLowerCase())
        );
    }, [data, globalFilter]);

    // Group tasks dynamically
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

    return (
        <div className="p-4">
            {/* Search & Group Buttons */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full md:w-1/2"
                />

                <div className="flex gap-2">
                    <button
                        onClick={() => setGroupBy("none")}
                        className={`px-4 py-2 rounded ${groupBy === "none" ? "bg-blue-500 text-white" : "bg-gray-200"
                            }`}
                    >
                        No Group
                    </button>
                    <button
                        onClick={() => setGroupBy("priority")}
                        className={`px-4 py-2 rounded ${groupBy === "priority" ? "bg-blue-500 text-white" : "bg-gray-200"
                            }`}
                    >
                        Group by Priority
                    </button>
                    <button
                        onClick={() => setGroupBy("status")}
                        className={`px-4 py-2 rounded ${groupBy === "status" ? "bg-blue-500 text-white" : "bg-gray-200"
                            }`}
                    >
                        Group by Status
                    </button>
                </div>
            </div>

            {/* Render grouped tables */}
            {Object.entries(groupedData).map(([groupName, tasks]) => (
                <div key={groupName} className="mb-6 border rounded-lg shadow">
                    {/* Header with collapse */}
                    <div
                        className="flex justify-between items-center bg-gray-100 px-4 py-2 cursor-pointer"
                        onClick={() =>
                            setCollapsedGroups((prev) => ({
                                ...prev,
                                [groupName]: !prev[groupName],
                            }))
                        }
                    >
                        <h2 className="font-semibold text-lg">
                            {groupBy !== "none" ? `${groupBy.toUpperCase()}: ${groupName}` : ""}
                        </h2>
                        <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                            {collapsedGroups[groupName] ? "+" : "-"}
                        </button>
                    </div>

                    {!collapsedGroups[groupName] && (
                        <table className="min-w-full border-t border-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left border-b">ID</th>
                                    <th className="px-4 py-2 text-left border-b">Title</th>
                                    <th className="px-4 py-2 text-left border-b">Status</th>
                                    <th className="px-4 py-2 text-left border-b">Priority</th>
                                    <th className="px-4 py-2 text-left border-b">Start Date</th>
                                    <th className="px-4 py-2 text-left border-b">End Date</th>
                                    <th className="px-4 py-2 text-left border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-t">{task.id}</td>
                                        <td className="px-4 py-2 border-t">{task.title}</td>
                                        <td className="px-4 py-2 border-t">
                                            <span
                                                className={`px-2 py-1 rounded text-white ${task.status === "done"
                                                    ? "bg-green-500"
                                                    : task.status === "in-progress"
                                                        ? "bg-blue-500"
                                                        : "bg-gray-400"
                                                    }`}
                                            >
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 border-t">
                                            <span
                                                className={`px-2 py-1 rounded ${task.priority === "high"
                                                    ? "bg-red-500 text-white"
                                                    : task.priority === "medium"
                                                        ? "bg-yellow-400 text-black"
                                                        : "bg-green-300 text-black"
                                                    }`}
                                            >
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 border-t">{task.startDate}</td>
                                        <td className="px-4 py-2 border-t">{task.endDate}</td>
                                        <td className="px-4 py-2 border-t flex gap-2">
                                            <a
                                                href={task.pdfLink}
                                                target="_blank"
                                                className="text-blue-600 hover:underline"
                                            >
                                                PDF
                                            </a>
                                            <a
                                                href={task.githubLink}
                                                target="_blank"
                                                className="text-gray-700 hover:underline"
                                            >
                                                GitHub
                                            </a>
                                        </td>
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

// import React, { useMemo, useState } from "react";
// import type { Task } from "../types";
// import {
//     useReactTable,
//     getCoreRowModel,
//     getSortedRowModel,
//     getFilteredRowModel,
//     flexRender,
//     type SortingState,
//     type ColumnDef,
// } from "@tanstack/react-table";

// const TaskTable: React.FC<{ data: Task[] }> = ({ data }) => {
//     const [sorting, setSorting] = useState<SortingState>([]);
//     const [globalFilter, setGlobalFilter] = useState("");

//     const columns = useMemo<ColumnDef<Task>[]>(
//         () => [
//             {
//                 header: "ID",
//                 accessorKey: "id",
//             },
//             {
//                 header: "Title",
//                 accessorKey: "title",
//             },
//             {
//                 header: "Status",
//                 accessorKey: "status",
//                 cell: (info) => {
//                     const value = info.getValue() as string;
//                     return (
//                         <span
//                             className={`px-2 py-1 rounded text-white ${value === "done"
//                                 ? "bg-green-500"
//                                 : value === "in-progress"
//                                     ? "bg-blue-500"
//                                     : "bg-gray-400"
//                                 }`}
//                         >
//                             {value}
//                         </span>
//                     );
//                 },

//             },
//             {
//                 header: "Priority",
//                 accessorKey: "priority",
//                 cell: (info) => {
//                     const value = info.getValue() as string;

//                     return (<span
//                         className={`px-2 py-1 rounded ${info.getValue() === "high"
//                             ? "bg-red-500 text-white"
//                             : info.getValue() === "medium"
//                                 ? "bg-yellow-400 text-black"
//                                 : "bg-green-300 text-black"
//                             }`}
//                     >
//                         {value}
//                     </span>)

//                 },
//             },
//             {
//                 header: "Start Date",
//                 accessorKey: "startDate",
//             },
//             {
//                 header: "End Date",
//                 accessorKey: "endDate",
//             },
//             {
//                 header: "Actions",
//                 cell: (info) => (
//                     <div className="flex gap-2">
//                         <a
//                             href={info.row.original.pdfLink}
//                             target="_blank"
//                             className="text-blue-600 hover:underline"
//                         >
//                             PDF
//                         </a>
//                         <a
//                             href={info.row.original.githubLink}
//                             target="_blank"
//                             className="text-gray-700 hover:underline"
//                         >
//                             GitHub
//                         </a>
//                     </div>
//                 ),
//             },
//         ],
//         []
//     );

//     const table = useReactTable({
//         data,
//         columns,
//         state: {
//             sorting,
//             globalFilter,
//         },
//         onSortingChange: setSorting,
//         onGlobalFilterChange: setGlobalFilter,
//         getCoreRowModel: getCoreRowModel(),
//         getSortedRowModel: getSortedRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//     });

//     return (
//         <div className="p-4">
//             {/* Search Filter */}
//             <input
//                 type="text"
//                 placeholder="Search tasks..."
//                 value={globalFilter ?? ""}
//                 onChange={(e) => setGlobalFilter(e.target.value)}
//                 className="mb-4 p-2 border border-gray-300 rounded w-full"
//             />

//             <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow">
//                 <thead className="bg-gray-100">
//                     {table.getHeaderGroups().map((headerGroup) => (
//                         <tr key={headerGroup.id}>
//                             {headerGroup.headers.map((header) => (
//                                 <th
//                                     key={header.id}
//                                     onClick={header.column.getToggleSortingHandler()}
//                                     className="px-4 py-2 text-left cursor-pointer select-none"
//                                 >
//                                     {flexRender(
//                                         header.column.columnDef.header,
//                                         header.getContext()
//                                     )}
//                                     {{
//                                         asc: " 🔼",
//                                         desc: " 🔽",
//                                     }[header.column.getIsSorted() as string] ?? null}
//                                 </th>
//                             ))}
//                         </tr>
//                     ))}
//                 </thead>
//                 <tbody>
//                     {table.getRowModel().rows.map((row) => (
//                         <tr key={row.id} className="hover:bg-gray-50">
//                             {row.getVisibleCells().map((cell) => (
//                                 <td key={cell.id} className="px-4 py-2 border-t">
//                                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                                 </td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default TaskTable;
