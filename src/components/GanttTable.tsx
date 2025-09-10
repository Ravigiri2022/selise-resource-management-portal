import React, { useEffect, useRef, useState } from "react";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";
import type { Task } from "../types";
import { useUsers } from "../context/UserProvider";
import { useTasks } from "../context/TaskContext";
import { logService } from "../services/services";

type Props = { tasks: Task[] };

const GanttTable: React.FC<Props> = ({ tasks }) => {
    interface GanttTask extends Task {
        id: number;
        title: string;
        description: string;
        assignedTo: number;
        assignedBy: number;
        startDate: string;
        endDate: string;
        status: "todo" | "in-progress" | "done" | "reschedule" | "unseen";
        priority: "low" | "medium" | "high";
        createdDate: string;
        pdfLink: string;
        githubLink: string;
        projectId: number;

        start_date: Date;
        end_date: Date;
        $original_start?: Date;
        $original_end?: Date;
        color?: string;
    }

    const [popupTask, setPopupTask] = useState<GanttTask | null>(null);
    const [msg, setMsg] = useState("");
    const { users, selectedUser, addToast } = useUsers();
    const ganttContainer = useRef<HTMLDivElement>(null);
    const [zoomLevel, setZoomLevel] = useState<"Day" | "Week" | "Month">("Week");
    const { fetchResLogs, fetchTasks, setSelectedTaskFn } = useTasks();

    /** ------------------ UTIL: FORMAT DATES ------------------ */
    function formatForBackendStart(date: Date | string): string {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day} 00:00`;
    }

    function formatForBackendEnd(date: Date | string): string {
        const d = new Date(date);
        // shift to next day for "24:00"
        d.setDate(d.getDate());
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day} 00:00`;
    }

    /** ------------------ GANTT CONFIG ------------------ */
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

    /** ------------------ INIT GANTT ------------------ */
    useEffect(() => {
        if (!ganttContainer.current) return;

        gantt.clearAll();
        gantt.config.date_format = "%Y-%m-%d %H:%i";
        gantt.init(ganttContainer.current);

        const ganttTasks: GanttTask[] = tasks.map((task) => ({
            id: task.id,
            text: task.title,
            title: task.title,
            description: task.description,
            githubLink: task.githubLink,
            pdfLink: task.pdfLink,
            projectId: task.projectId,
            start_date: new Date(task.startDate), // keep as Date
            end_date: new Date(task.endDate),     // keep as Date
            priority: task.priority,
            assignedBy: task.assignedBy,
            assignedTo: task.assignedTo,
            $original_start: new Date(task.startDate),
            $original_end: new Date(task.endDate),
            createdDate: task.createdDate,
            status: task.status,
            color:
                task.status === "done"
                    ? "#28A745"
                    : task.status === "todo"
                        ? "#007BFF"
                        : task.status === "in-progress"
                            ? "#FFD700"
                            : task.status === "reschedule"
                                ? "#6F42C1"
                                : "#6C757D",
        }));

        /** Save original dates before change */
        gantt.attachEvent("onBeforeTaskChanged", (id: number, _mode: unknown, task: GanttTask) => {
            console.log("[BEFORE CHANGE]", {
                id,
                start_date: task.start_date,
                end_date: task.end_date,
                $original_start: task.$original_start,
                $original_end: task.$original_end,
            });
            if (!task.$original_start) task.$original_start = new Date(task.start_date);
            if (!task.$original_end) task.$original_end = new Date(task.end_date);
            return true;
        });

        /** Open popup after dragging */
        gantt.attachEvent("onAfterTaskDrag", (id: number) => {
            const task = gantt.getTask(id) as GanttTask;
            if (
                (task.$original_start?.getTime() !== task.start_date.getTime() ||
                    task.$original_end?.getTime() !== task.end_date.getTime())
            ) {
                gantt.showLightbox(id);
            }
        });

        /** When popup confirm (lightbox) */
        gantt.attachEvent("onLightboxSave", (id: number, task: GanttTask) => {
            console.log("[LIGHTBOX SAVE]", {
                id,
                start_date: task.start_date,
                end_date: task.end_date,
                $original_start: task.$original_start,
                $original_end: task.$original_end,
            });
            if (
                task.$original_start?.getTime() !== task.start_date.getTime() ||
                task.$original_end?.getTime() !== task.end_date.getTime()
            ) {
                // console.log("***", task);
                setPopupTask(task);
            }
            return true;
        });

        /** When popup cancel */
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

        /** Task color by priority */
        gantt.templates.task_class = (task: Task) => {
            if (task.priority === "high") return "task-high";
            if (task.priority === "medium") return "task-medium";
            if (task.priority === "low") return "task-low";
            return "";
        };

        /** Table columns */
        gantt.config.columns = [
            { name: "text", label: "Tasks", tree: false, width: "*" },
            {
                name: "assignedBy",
                label: "Assigned By",
                align: "start",
                template: (task: Task) => {
                    const user = users.find((u) => Number(u.id) === Number(task.assignedTo));
                    return user ? user.name : "-";
                },
            },
        ];

        gantt.config.scales = zoomConfig[zoomLevel].scales;
        gantt.render();
    }, [tasks, zoomLevel, users]);

    /** ------------------ ZOOM HANDLERS ------------------ */
    const handleZoomIn = () => {
        if (zoomLevel === "Month") setZoomLevel("Week");
        else if (zoomLevel === "Week") setZoomLevel("Day");
    };

    const handleZoomOut = () => {
        if (zoomLevel === "Day") setZoomLevel("Week");
        else if (zoomLevel === "Week") setZoomLevel("Month");
    };

    /** ------------------ SUBMIT HANDLER ------------------ */
    const handleSubmit = async () => {
        if (!popupTask || !popupTask.start_date || !popupTask.end_date) {
            addToast("error", "Invalid task data", 2000);
            return;
        }
        console.log("[HANDLE SUBMIT] Sending log with:", {
            id: popupTask.id,
            oldStartDate: popupTask.$original_start,
            oldEndDate: popupTask.$original_end,
            newStartDate: popupTask.start_date,
            newEndDate: popupTask.end_date,
        });

        const log = {
            log: {
                taskId: popupTask.id,
                requestedBy: selectedUser?.role,
                requestedById: selectedUser?.id,
                oldStartDate: formatForBackendStart(popupTask.$original_start!),
                oldEndDate: formatForBackendEnd(popupTask.$original_end!),
                newStartDate: formatForBackendStart(popupTask.start_date),
                newEndDate: formatForBackendEnd(popupTask.end_date),
                reason: msg,
            },
        };

        try {
            await logService.create(log);
            fetchResLogs(popupTask.id);
            const taskToSet: Task = {
                id: popupTask.id,
                title: popupTask.title,
                description: popupTask.description,
                startDate: formatForBackendStart(popupTask.start_date),
                endDate: formatForBackendEnd(popupTask.end_date),
                priority: popupTask.priority,
                assignedBy: popupTask.assignedBy,
                assignedTo: popupTask.assignedTo,
                status: "reschedule",
                pdfLink: popupTask.pdfLink,
                githubLink: popupTask.githubLink,
                createdDate: popupTask.createdDate,
                projectId: popupTask.projectId,
            };
            // console.log(taskToSet);
            setSelectedTaskFn(taskToSet);
            setMsg("");
            setPopupTask(null); // close popup after success
            fetchTasks();
            addToast("success", "Successfully Sent", 2000);
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            addToast("error", "Failed to send", 2000);
        }
    };

    /** ------------------ UI ------------------ */
    return (
        <div className="w-full bg-white p-4 rounded-2xl shadow">
            {/* Confirm Popup */}
            {popupTask && (
                <form
                    className="fixed inset-0 flex items-center justify-center z-30 bg-black/30"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <div className="bg-white relative flex flex-col items-center justify-center border p-3 rounded-lg w-[70vh]">
                        <h2 className="font-bold mb-2">Confirm Reschedule</h2>
                        <p className="text-red-500 text-sm p-1 border text-justify mb-2">
                            Once you Confirm you won't be able to Reschedule this task until your manager has confirmed the changes.
                        </p>

                        {popupTask.status === "reschedule" && (
                            <p className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/60">
                                <span className="bg-white p-3 border border-red-500">
                                    This Task is Under Reschedule. Can't Edit
                                </span>
                            </p>
                        )}

                        <p>
                            Old Dates:{" "}
                            <span className="text-sm font-mono text-blue-400">
                                {popupTask.$original_start?.toLocaleDateString()}
                            </span>{" "}
                            -{" "}
                            <span className="text-sm font-mono text-blue-400">
                                {popupTask.$original_end?.toLocaleDateString()}
                            </span>
                        </p>
                        <p>
                            New Dates:{" "}
                            <span className="text-sm font-mono text-blue-400">
                                {popupTask.start_date.toLocaleDateString()}
                            </span>{" "}
                            -{" "}
                            <span className="text-sm font-mono text-blue-400">
                                {popupTask.end_date.toLocaleDateString()}
                            </span>
                        </p>

                        <textarea
                            placeholder="Message goes here"
                            value={msg}
                            required
                            onChange={(e) => setMsg(e.target.value)}
                            className="w-full border mt-2 mb-2 p-1"
                        />

                        <div className="flex gap-2 justify-end">
                            <button
                                type="submit"
                                className={`px-3 py-1 bg-green-500 cursor-pointer text-white rounded ${popupTask.status === "reschedule" && "cursor-not-allowed"
                                    }`}
                            >
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
                                className="px-3 py-1 bg-red-500 z-10 cursor-pointer text-white rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
                <h2 className="text-lg font-bold">📅 Project Timeline (Gantt Chart)</h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleZoomIn}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Zoom In
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Zoom Out
                    </button>
                </div>
            </div>

            {/* Scrollable Gantt container */}
            <div className="overflow-x-auto pb-4 w-fit bg-black">
                <div
                    ref={ganttContainer}
                    style={{
                        width: "1200px",
                        height: "70vh",
                    }}
                />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center md:justify-end gap-3 border-t pt-3 mt-3">
                <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-[#007BFF] mr-1"></div>
                    <span className="text-sm">Todo</span>
                </div>
                <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-[#FFD700] mr-1"></div>
                    <span className="text-sm">In-Progress</span>
                </div>
                <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-[#28A745] mr-1"></div>
                    <span className="text-sm">Done</span>
                </div>
                <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-[#6F42C1] mr-1"></div>
                    <span className="text-sm">Reschedule</span>
                </div>
                <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-[#6C757D] mr-1"></div>
                    <span className="text-sm">Unseen</span>
                </div>
            </div>
        </div>
    );
};

export default GanttTable;
