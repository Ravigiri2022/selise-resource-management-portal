import React from "react";
import type { Task } from "../types";
import GanttTable from "./GanttTable";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const EmployeeWorkLoad: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    const COLORS = ["#22c55e", "#eab308", "#3b82f6", "#a855f7", "#ef4444"];

    const counts = {
        completed: tasks.filter((t) => t.status === "done").length,
        pending: tasks.filter((t) => t.status === "in-progress").length,
        todo: tasks.filter((t) => t.status === "todo").length,
        rescheduled: tasks.filter((t) => t.status === "reschedule").length,
    };

    const total = tasks.length || 1;

    const data = Object.entries(counts).map(([key, value]) => ({
        name: key,
        value,
    }));

    return (
        <div className="p-4 md:p-6 max-h-[90vh] overflow-y-auto space-y-6">
            {/* Title + Gantt */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <h1 className="text-2xl font-bold mb-4">Employee Workload</h1>
                <GanttTable tasks={tasks} />
            </div>

            {/* Stats Section */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <h1 className="text-xl font-bold mb-6">Statistical Data</h1>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Chart */}
                    <div className="flex-1 flex flex-col items-center">
                        <h2 className="text-lg font-semibold mb-4">Task Progress</h2>
                        <div className="w-full h-80">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={110}
                                        paddingAngle={3}
                                        dataKey="value"
                                        animationBegin={0}
                                        animationDuration={800}
                                        animationEasing="ease-out"
                                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Stats List */}
                    <div className="flex-1 flex flex-col justify-center space-y-3">
                        <h2 className="text-lg font-semibold mb-2">Task Statistics</h2>
                        {Object.entries(counts).map(([key, value], index) => (
                            <div
                                key={key}
                                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
                            >
                                <span className="font-medium capitalize">{key}</span>
                                <span
                                    className="font-bold"
                                    style={{ color: COLORS[index % COLORS.length] }}
                                >
                                    {value} / {total}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeWorkLoad;
