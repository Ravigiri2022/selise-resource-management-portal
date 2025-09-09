import type { Task } from "../types"
import { AiFillGithub, AiOutlineFilePdf, AiOutlineLeft, AiOutlineLink } from "react-icons/ai";
import GanttTable from "./GanttTable";
import { useTasks } from "../context/TaskContext";
import { useUsers } from "../context/UserProvider";
import RescheduleLog from "./RescheduleLog";
import ProfileCircle from "./ProfileCircle";
import { useEffect } from "react";
import { taskService } from "../services/services";
import { useRef } from "react";


const TaskDetails: React.FC<{ task: Task, setTask: (value: Task | null) => void }> = ({ task, setTask }) => {
    const { fetchTasks, fetchResLogs, resLogs } = useTasks();
    const { users, selectedUser, addToast } = useUsers();
    const assByUser = users?.find((user) => Number(user.id) === Number(task.assignedBy));
    const assToUser = users?.find((user) => Number(user.id) === Number(task.assignedTo));
    const toastShown = useRef(false);
    const handleStatusChange = async () => {
        if (task.status === "todo") {
            try {
                const res = await taskService.updateStatus(task.id, "in-progress");
                setTask(res);
                fetchTasks();
                addToast("success", "Marked as in-progress", 2000)

            } catch (err) {
                console.error("Failed to update task status:", err);

            }
        }
        else if (task.status === "in-progress") {
            try {
                const res = await taskService.updateStatus(task.id, "done");
                setTask(res);
                fetchTasks();
                addToast("success", "Marked as in-progress", 2000)

            } catch (err) {
                console.error("Failed to update task status:", err);

            }
        }
    }

    useEffect(() => {
        fetchResLogs(Number(task.id));
        const updateStatusIfUnseen = async () => {
            if (!task || !selectedUser) return;
            if (task.status === "unseen" && selectedUser.role !== "manager" && !toastShown.current) {
                try {
                    const updated = await taskService.updateStatus(task.id, "todo");
                    setTask(updated);
                    fetchTasks();
                    addToast("success", "Marked as Seen", 2000)

                } catch (err) {
                    console.error("Failed to update task status:", err);
                }
            }
        };
        updateStatusIfUnseen();
    }, []);

    return (
        <div className="p-3 w-full">
            <div className="overflow-y-auto relative space-y-6">
                {/* Back button */}
                <button
                    onClick={() => setTask(null)}
                    className="bg-white sticky top-0 flex items-center space-x-1 px-3 py-1 rounded-full shadow-sm border hover:bg-gray-100 transition"
                >
                    <AiOutlineLeft /> <span>Back</span>
                </button>

                {/* Title + Dates */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <h2 className="text-3xl font-bold">{task.title}</h2>
                    <div className="px-4 py-2 border rounded-lg shadow-sm bg-white text-sm">
                        <p><span className="font-semibold">Start Date:</span> {task.startDate}</p>
                        <p><span className="font-semibold">End Date:</span> {task.endDate}</p>
                    </div>
                </div>

                {/* Status + Priority + Assigned */}
                <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 items-start lg:items-center bg-gray-50 p-3 rounded-xl shadow-sm">
                    {/* Status */}
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold">Status:</span>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${task.status === "done" ?
                                "bg-emerald-100 text-emerald-700" : task.status === "in-progress" ?
                                    "bg-yellow-100 text-yellow-700" : task.status === "reschedule" ?
                                        "bg-purple-200 text-purple-700" : task.status === "unseen" ?
                                            "bg-gray-200 text-gray-700" : "bg-blue-200 text-blue-700"}`}
                        >
                            {task.status}
                        </span>
                    </div>

                    {/* Priority */}
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold">Priority:</span>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${task.priority === "high" ?
                                "bg-red-200 text-red-700" : task.priority === "medium" ?
                                    "bg-orange-200 text-orange-700" : "bg-teal-200 text-teal-700"}`}
                        >
                            {task.priority}
                        </span>
                    </div>

                    {/* Assigned to */}
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold">Assigned to:</span>
                        <div
                            className="flex items-center space-x-2 px-2 py-1 rounded-full text-white shadow-sm"
                            style={{ backgroundColor: assToUser?.colorHex }}
                        >
                            <ProfileCircle
                                name={assToUser?.name ?? ""}
                                colorHex={assToUser?.colorHex ?? "#858585"}
                                size={28}
                            />
                            <span className="text-sm">{assToUser?.name}</span>
                        </div>
                    </div>

                    {/* Assigned by */}
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold">Assigned by:</span>
                        <div
                            className="flex items-center space-x-2 px-2 py-1 rounded-full text-white shadow-sm"
                            style={{ backgroundColor: assByUser?.colorHex }}
                        >
                            <ProfileCircle
                                name={assByUser?.name ?? ""}
                                colorHex={assByUser?.colorHex ?? "#858585"}
                                size={28}
                            />
                            <span className="text-sm">{assByUser?.name}</span>
                        </div>
                        <span>:</span>
                        {selectedUser?.role === "employee" && task.status !== "reschedule" && task.status !== "done" ? (
                            <div>
                                <div className={`bg-gray-300 font-semibold gap-2 px-2 w-fit text-xs py-1 flex flex-col rounded-lg border cursor-pointer sm:text-base sm:flex-row md:text-sm hover:shadow-sm ${task.status === "todo" ? "bg-yellow-100 text-yellow-700" : task.status === "in-progress" ? "bg-green-200 text-green-700" : "border"}`}
                                    onClick={() => handleStatusChange()}>
                                    <span>Mark as:</span> <span>{task.status === "todo" ? "In-Progress" : "Done"}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm font-semibold text-gray-400 ">
                                {task.status === "reschedule" ? "Waiting for the reschedule action" : "Marked as Done"}
                            </div>
                        )}
                    </div>
                </div>

                {/* Links */}
                <div className="flex flex-col sm:flex-row gap-6">
                    {/* PDF */}
                    <div className="flex items-center gap-2 text-sm">
                        <AiOutlineFilePdf className="text-2xl" />
                        <a
                            href={task.pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline italic text-blue-600"
                        >
                            PDF Link
                        </a>
                        <AiOutlineLink
                            className="cursor-pointer hover:text-gray-600"
                            onClick={() => navigator.clipboard.writeText(task.pdfLink)}
                        />
                    </div>

                    {/* GitHub */}
                    <div className="flex items-center gap-2 text-sm">
                        <AiFillGithub className="text-2xl" />
                        <a
                            href={task.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline italic text-blue-600"
                        >
                            GitHub Repo
                        </a>
                        <AiOutlineLink
                            className="cursor-pointer hover:text-gray-600"
                            onClick={() => navigator.clipboard.writeText(task.githubLink)}
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <h2 className="font-semibold">Description:</h2>
                    <div className="border rounded-lg h-[30vh] p-3 bg-white overflow-y-auto shadow-sm">
                        {task.description}
                    </div>
                </div>

                {/* Gantt + Reschedule Logs */}
                <div className="space-y-6">
                    <GanttTable tasks={[task]} />
                    <RescheduleLog resLogs={resLogs} task={task} setTask={setTask} />
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
