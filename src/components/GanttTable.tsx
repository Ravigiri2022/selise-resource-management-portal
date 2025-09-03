import React, { useEffect, useRef, useState } from "react";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";
import type { Task } from "../types";
import { useUsers } from "../context/UserProvider";

type Props = { tasks: Task[] };

const GanttTable: React.FC<Props> = ({ tasks }) => {
    interface GanttTask extends Task {
        start_date: Date;
        end_date: Date;
        $original_start?: Date;
        $original_end?: Date;
        color?: string;
    }

    const [popupTask, setPopupTask] = useState<GanttTask | null>(null);
    const { users } = useUsers();
    const ganttContainer = useRef<HTMLDivElement>(null);
    const [zoomLevel, setZoomLevel] = useState<"Day" | "Week" | "Month">("Week");

    const zoomConfig = {
        Day: { scale_height: 50, scales: [{ unit: "day", step: 1, format: "%d %M" }] },
        Week: {
            scale_height: 50,
            scales: [
                { unit: "week", step: 1, format: "Week %W" },
                { unit: "day", step: 1, format: "%d %M" },
            ],
        },
        Month: { scale_height: 50, scales: [{ unit: "month", step: 1, format: "%M %Y" }] },
    };

    useEffect(() => {
        if (!ganttContainer.current) return;

        gantt.clearAll();
        gantt.config.date_format = "%Y-%m-%d %H:%i";
        gantt.init(ganttContainer.current);

        const ganttTasks: GanttTask[] = tasks.map((task) => ({
            id: task.id,
            text: task.title,
            start_date: new Date(task.startDate),
            end_date: new Date(task.endDate),
            priority: task.priority,
            assignedBy: task.assignedBy,
            assignedTo: task.assignedTo,
            $original_start: new Date(task.startDate),
            $original_end: new Date(task.endDate),
            status: task.status,
            color:
                task.status === "done"
                    ? "#22c55e"
                    : task.status === "todo"
                        ? "#fbbf24"
                        : task.status === "in-progress"
                            ? "#3b82f6"
                            : "#808080",
        }));


        // Save original dates
        gantt.attachEvent("onBeforeTaskChanged", (id: number, mode: any, task: GanttTask) => {
            if (!task.$original_start) task.$original_start = new Date(task.start_date);
            if (!task.$original_end) task.$original_end = new Date(task.end_date);
            return true;
        });

        // Show lightbox only if dates changed and not reschedule
        gantt.attachEvent("onAfterTaskDrag", (id: number) => {
            const task = gantt.getTask(id) as GanttTask;
            if (
                (task.$original_start?.getTime() !== task.start_date.getTime() ||
                    task.$original_end?.getTime() !== task.end_date.getTime())
            ) {
                gantt.showLightbox(id);
            }
        });

        // Custom confirmation popup after lightbox save
        gantt.attachEvent("onLightboxSave", (id: number, task: GanttTask) => {
            const t = task as GanttTask;
            if (
                t.$original_start?.getTime() !== t.start_date.getTime() ||
                t.$original_end?.getTime() !== t.end_date.getTime()
            ) {
                setPopupTask(t);
                console.log("TTTTTT: ", t);
            }
            return true;
        });

        // Restore dates if lightbox canceled
        gantt.attachEvent("onLightboxCancel", (id: number) => {
            const task = gantt.getTask(id) as GanttTask;
            if (task.$original_start && task.$original_end) {
                task.start_date = new Date(task.$original_start);
                task.end_date = new Date(task.$original_end);
                gantt.updateTask(id);
            }
        });

        gantt.parse({ data: ganttTasks });
        gantt.config.autosize = "y";

        gantt.templates.task_class = (task: any) => {
            if (task.priority === "high") return "task-high";
            if (task.priority === "medium") return "task-medium";
            if (task.priority === "low") return "task-low";
            return "";
        };

        gantt.config.columns = [
            { name: "text", label: "Tasks", tree: false, width: "*" },
            {
                name: "assignedBy",
                label: "Assigned By",
                align: "start",
                template: (task: Task) => {
                    const user = users.find((u) => u.id === task.assignedTo);
                    return user ? user.name : "-";
                },
            },
        ];

        gantt.config.scales = zoomConfig[zoomLevel].scales;
        gantt.render();
    }, [tasks, zoomLevel, users]);

    const handleZoomIn = () => {
        if (zoomLevel === "Month") setZoomLevel("Week");
        else if (zoomLevel === "Week") setZoomLevel("Day");
    };

    const handleZoomOut = () => {
        if (zoomLevel === "Day") setZoomLevel("Week");
        else if (zoomLevel === "Week") setZoomLevel("Month");
    };

    return (
        <div className=" w-full bg-white p-4 rounded-2xl shadow">
            {/* Custom Confirm Popup */}
            {popupTask && (
                <div className="fixed inset-0 flex items-center justify-center z-30 bg-black/30">
                    <div className="bg-white relative flex flex-col items-center justify-center border p-3 rounded-lg w-[70vh]">
                        <h2 className="font-bold mb-2">Confirm Reschedule</h2>
                        <p className="text-red-500 text-sm p-1 border text-justify mb-2">
                            Once you Confirm you won't be able to Reschedule this task until your manager has confirmed the changes.
                        </p>
                        {popupTask.status === "reschedule" && (
                            <p className="absolute inset-0 z-10 flex items-center justify-center  rounded-lg bg-black/60">
                                <span className="bg-white p-3 border border-red-500">This Task is Under Reschedule. Cant't Edit</span>
                            </p>
                        )}
                        <p>
                            Old Dates: <span className="text-sm font-mono text-blue-400">{popupTask.$original_start?.toLocaleString()}</span> - <span className="text-sm font-mono text-blue-400">{popupTask.$original_end?.toLocaleString()}</span>
                        </p>
                        <p>
                            New Dates: <span className="text-sm font-mono text-blue-400">{popupTask.start_date.toLocaleString()}</span> - <span className="text-sm font-mono text-blue-400">{popupTask.end_date.toLocaleString()}</span>
                        </p>

                        <textarea placeholder="Message goes here" className="w-full border mt-2 mb-2 p-1" />

                        <div className="flex gap-2 justify-end">
                            <button onClick={popupTask.status === "reschedule" ? () => console.log("Confirm clicked and not sent") : () => console.log("Confirm clicked action")} className={`px-3 py-1 bg-green-500 text-white rounded ${popupTask.status === "reschedule" && "cursor-not-allowed"}`}>
                                Confirm
                            </button>
                            <button
                                onClick={() => {
                                    if (popupTask?.id != null) {
                                        const task = gantt.getTask(popupTask.id) as GanttTask;
                                        if (task.$original_start && task.$original_end) {
                                            task.start_date = new Date(task.$original_start);
                                            task.end_date = new Date(task.$original_end);
                                            gantt.updateTask(task.id);
                                        }
                                    }
                                    setPopupTask(null);
                                }}
                                className="px-3 py-1 bg-red-500 z-10 text-white rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )
            }

            {/* Toolbar */}
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">📅 Project Timeline (Gantt Chart)</h2>
                <div className="flex gap-2">
                    <button onClick={handleZoomIn} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Zoom In
                    </button>
                    <button onClick={handleZoomOut} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Zoom Out
                    </button>
                </div>
            </div>

            <div ref={ganttContainer} style={{ width: "100%" }} />

            <div className="border-dotted h-[7vh] flex items-center p-5 justify-end" style={{ width: "100%" }}>
                <div className="flex items-center text-center mr-3">
                    <div className="h-3 w-3 rounded-full bg-[#fbbf24] mr-1"></div>
                    <span>Todo</span>
                </div>
                <div className="flex items-center text-center mr-3">
                    <div className="h-3 w-3 rounded-full bg-[#3b82f6] mr-1"></div>
                    <span>In-Progress</span>
                </div>
                <div className="flex items-center text-center mr-3">
                    <div className="h-3 w-3 rounded-full bg-[#22c55e] mr-1"></div>
                    <span>Done</span>
                </div>
                <div className="flex items-center text-center mr-3">
                    <div className="h-3 w-3 rounded-full bg-[#808080] mr-1"></div>
                    <span>Reschedule</span>
                </div>
            </div>
        </div >
    );
};

export default GanttTable;
