import React from 'react'
import type { Task } from '../types'
import GanttTable from './GanttTable'
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";


const EmployeeWorkLoad: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    // const data = [
    //     { name: "Completed", value: 40 },
    //     { name: "Pending", value: 20 },
    //     { name: "Rescheduled", value: 15 },
    //     { name: "Unseen", value: 10 },
    //     { name: "Not Done", value: 15 },
    // ];
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
        <div className='p-3 max-h-[90vh] overflow-auto'>
            <div>
                <h1 className='text-2xl font-semibold p-3'>Employee Workload</h1>
                <GanttTable tasks={tasks} />
            </div>
            <div className=''>
                <h1 className='p-3 text-xl font-semibold'>Statistical Data: </h1>

                <div className="flex items-center justify-center bg-white p-6 rounded-2xl shadow-lg">
                    <div className='flex-1 flex flex-col items-center justify-center'>
                        <h2 className="text-lg font-semibold mb-4">Task Progress</h2>
                        <PieChart width={420} height={420}>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={3}
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={800}
                                animationEasing="ease-out"
                                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>


                    <div className='flex flex-col flex-1 justify-center space-y-3'>
                        <h2 className='text-xl font-bold'>Task Statistics</h2>
                        {Object.entries(counts).map(([key, value]) => (
                            <div
                                key={key}
                                className='flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm'>
                                <span className='font-medium capitalize'>
                                    {key}
                                </span>
                                <span className='font-bold'
                                    style={{ color: COLORS[key as keyof typeof COLORS] }}>
                                    {value} / {total}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeWorkLoad