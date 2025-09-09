import { AiOutlineArrowRight, AiOutlineClose } from "react-icons/ai";
import type { resLog, Task } from "../types";
import { useUsers } from "../context/UserProvider";
import { useState } from "react";
import { logService } from "../services/services";
import { useTasks } from "../context/TaskContext";

const RescheduleLog: React.FC<{ resLogs: resLog[], task: Task }> = ({ resLogs, task }) => {
    resLogs.sort((a, b) => b.id - a.id);
    const { users, selectedUser, addToast } = useUsers();
    const { fetchResLogs, fetchTasks, setSelectedTaskFn } = useTasks();
    const [logAction, setLogAction] = useState("");
    const [log, setLog] = useState<resLog | null>(null);
    const [message, setMessage] = useState<string>("");
    const fetchDate = () => {
        const today = new Date();
        const formated = today.toISOString().split("T")[0]
        return formated;
    }


    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
        message: string,
        status: "accepted" | "rejected") => {
        e.preventDefault(); // <-- Prevent page refresh

        if (!log) return;
        const updatedLog = {
            updated_log: {
                actionMesg: message,
                status: status,
                actionDate: fetchDate(),
                actionBy: selectedUser?.id
            },
        }
        const updatedTask = {
            ...task,
            status: "todo" as Task["status"]
        }

        try {
            await logService.patch(log?.id, updatedLog);
            fetchResLogs(task.id);
            setLog(null);
            setLogAction("");
            setMessage("");
            fetchTasks();
            setSelectedTaskFn(updatedTask);
            addToast("successfully ", `Task ${status}`, 2000)

        } catch (err) {
            console.log(err);
            addToast("error", "err", 2000);
        }


    }

    return (
        <div className="bg-white h-fit m-2 rounded-xl p-4 border border-gray-300 shadow-md">
            {/* Modal */}
            {logAction && (
                <div className="fixed inset-0 bg-black/50 z-20 flex items-center justify-center">
                    <div className="bg-white w-[90%] max-w-lg rounded-xl shadow-lg overflow-hidden">
                        {/* Modal Header */}
                        <div
                            className={`flex items-center justify-between p-3 ${logAction === "accepted"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            <p className="capitalize font-semibold">{logAction}</p>
                            <button
                                onClick={() => {
                                    setLogAction("");
                                    setLog(null);
                                    setMessage("");
                                }}
                                className="hover:text-black"
                            >
                                <AiOutlineClose />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5 space-y-4">
                            {logAction === "accepted" ? (
                                <form onSubmit={(e) => handleSubmit(e, message, "accepted")}>
                                    <p className="text-center font-semibold">Changes Made:</p>
                                    <p className="text-center text-gray-600">
                                        New changes are recorded and saved.
                                    </p>

                                    <div className="grid grid-cols-2 gap-x-4 text-sm">
                                        <div className="space-y-1 font-semibold">
                                            <p>Old Start Date:</p>
                                            <p>Old End Date:</p>
                                            <p>New Start Date:</p>
                                            <p>New End Date:</p>
                                        </div>
                                        <div className="space-y-1 text-gray-700">
                                            <p>{log?.oldStartDate}</p>
                                            <p>{log?.oldEndDate}</p>
                                            <p>{log?.newStartDate}</p>
                                            <p>{log?.newEndDate}</p>
                                        </div>
                                    </div>

                                    <p className="font-semibold">
                                        Changes Made By:{" "}
                                        <span className="italic font-normal">
                                            {users.find((t) => t.id === selectedUser?.id)?.name}
                                        </span>
                                    </p>

                                    <label className="font-semibold">Message:</label>
                                    <textarea
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        className="border w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                                    ></textarea>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                setLogAction("");
                                                setLog(null);
                                            }}
                                            className="bg-gray-400 text-white px-4 py-1.5 rounded-lg hover:bg-gray-500"
                                        >
                                            Cancel
                                        </button>
                                        <button className="bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-500"
                                            type="submit">

                                            Confirm
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={(e) => handleSubmit(e, message, "rejected")}>
                                    <p className="text-center font-semibold">
                                        Changes Not To Be Made:
                                    </p>
                                    <p className="text-center text-gray-600">
                                        Changes won't be made and the old dates will remain.
                                    </p>

                                    <div className="grid grid-cols-2 gap-x-4 text-sm">
                                        <div className="font-semibold">
                                            <p>Start Date:</p>
                                            <p>End Date:</p>
                                        </div>
                                        <div>
                                            <p>{log?.oldStartDate}</p>
                                            <p>{log?.oldEndDate}</p>
                                        </div>
                                    </div>

                                    <p className="font-semibold">
                                        Action By:{" "}
                                        <span className="italic font-normal">
                                            {users.find((t) => t.id === selectedUser?.id)?.name}
                                        </span>
                                    </p>

                                    <label className="font-semibold">Message:</label>
                                    <textarea
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="border w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                                    ></textarea>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                setLogAction("");
                                                setLog(null);
                                            }}
                                            className="bg-gray-400 text-white px-4 py-1.5 rounded-lg hover:bg-gray-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-500"
                                            type="submit"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Logs */}
            <h2 className="font-semibold text-xl mb-4">Reschedule Logs</h2>

            <div className="space-y-4">
                {resLogs.map((log) => (
                    <div
                        key={log.id}
                        className="border rounded-lg shadow-sm overflow-hidden"
                    >
                        {/* Status */}
                        <div
                            className={`text-center px-3 py-1 font-medium ${log.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : log.status === "accepted"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                        >
                            {log.status}
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Request Info */}
                            <div className="flex-1 space-y-1 text-sm">
                                <p>
                                    <span className="font-semibold">Date:</span>{" "}
                                    {log.created_at}
                                </p>
                                <p>
                                    <span className="font-semibold">Initiated By:</span>{" "}
                                    {users.find((u) => Number(u?.id) === Number(log?.requestedById))?.name}
                                </p>
                                <p>
                                    <span className="font-semibold">Message:</span> {log.reason}
                                </p>
                            </div>

                            {/* Arrow */}
                            <div className="hidden md:flex items-center justify-center">
                                <AiOutlineArrowRight className="text-gray-400 text-xl" />
                            </div>

                            {/* Change Dates */}
                            <div className="flex-1 space-y-1 text-sm">
                                <p className="font-semibold">Changes</p>
                                <p>
                                    <span className="font-semibold">Old:</span>{" "}
                                    {log.oldStartDate} – {log.oldEndDate}
                                </p>
                                <p>
                                    <span className="font-semibold">New:</span>{" "}
                                    {log.newStartDate} – {log.newEndDate}
                                </p>
                            </div>

                            {/* Arrow */}
                            <div className="hidden md:flex items-center justify-center">
                                <AiOutlineArrowRight className="text-gray-400 text-xl" />
                            </div>

                            {/* Action Info */}
                            <div className="flex-1 space-y-1 text-sm">
                                <p>
                                    <span className="font-semibold">Date:</span>{" "}
                                    {log.actionDate || "xxxx-xx-xx"}
                                </p>

                                {Number(log.requestedById) !== Number(selectedUser?.id) && log.status === "pending" ? (
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">Action:</span>
                                        <button
                                            onClick={() => {
                                                setLogAction("accepted");
                                                setLog(log);
                                            }}
                                            className="bg-green-600 text-white px-3 py-0.5 rounded-lg text-sm hover:bg-green-500"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => {
                                                setLogAction("rejected");
                                                setLog(log);
                                            }}
                                            className="bg-red-600 text-white px-3 py-0.5 rounded-lg text-sm hover:bg-red-500"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                ) : (
                                    <p>
                                        <span className="font-semibold">Action By:</span>{" "}
                                        {log.actionBy
                                            ? users.find((u) => Number(u?.id) === Number(log?.actionBy))?.name
                                            : "-------"}
                                    </p>
                                )}

                                <p>
                                    <span className="font-semibold">Message:</span>{" "}
                                    {log.actionMesg || "-------"}
                                </p>
                            </div>
                        </div>

                        {/* Footer Status */}
                        <div
                            className={`text-center px-3 py-2 text-sm font-medium ${log.status === "rejected"
                                ? "bg-red-50 text-red-600"
                                : log.status === "accepted"
                                    ? "bg-green-50 text-green-600"
                                    : "bg-amber-50 text-amber-600"
                                }`}
                        >
                            {log.status === "accepted"
                                ? "The new changes are updated and kept"
                                : log.status === "pending"
                                    ? "Waiting for action"
                                    : "Was rejected and the old dates were kept"}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RescheduleLog;
