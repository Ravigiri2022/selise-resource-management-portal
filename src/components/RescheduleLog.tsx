import { AiOutlineArrowRight, AiOutlineClose } from "react-icons/ai"
import type { resLog } from "../types"
import { useUsers } from "../context/UserProvider"
import { useState } from "react";
const RescheduleLog: React.FC<{ resLogs: resLog[] }> = ({ resLogs }) => {
    const { users, selectedUser } = useUsers();
    const [logAction, setLogAction] = useState("");
    const [log, setLog] = useState<resLog | null>();

    return (
        <div className="bg-white h-fit m-2 rounded-lg p-2 border border-gray-400/50 shadow-lg">
            {logAction && (
                <div className="fixed flex items-center justify-center inset-0 bg-black/50 z-10">
                    <div className="bg-white w-[60vh] h-[50vh]">
                        <div className={`w-full flex p-3  items-center justify-between ${logAction === "accepted" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}><p className="capitalize">{logAction}</p><span onClick={() => { setLogAction(""); setLog(null); }}><AiOutlineClose /></span></div>
                        {logAction === "accepted" ? (
                            <div className="p-5">
                                <p className="text-center space-y-2 font-semibold">Changes Made: </p>
                                <p className="text-center ">New Changes are recorded and saved</p>
                                <div className="flex">
                                    <div>
                                        <p className="font-semibold">Old Start Date: </p>
                                        <p className="font-semibold">Old End Date: </p>
                                        <p className="font-semibold">New Start Date: </p>
                                        <p className="font-semibold">New End Date:</p>
                                    </div>
                                    <div>
                                        <p>{log?.oldStartDate} </p>
                                        <p>{log?.oldEndDate}</p>
                                        <p>{log?.newStartDate}</p>
                                        <p>{log?.newEndDate}</p>
                                    </div>
                                </div>
                                <p className="font-semibold">Changes Made By <span className="italic font-normal">{users.find((t) => t.id === selectedUser?.id)?.name}</span></p>
                                <p className="font-semibold">Message:</p>
                                <textarea rows="5" className="border w-full"></textarea>

                                <div className="w-full flex justify-end gap-1">
                                    <div className="bg-gray-400 px-2 text-white cursor-default" onClick={() => { setLogAction(""); setLog(null); }}>
                                        Cancel
                                    </div>
                                    <div className="bg-green-600 px-2 text-white cursor-default">
                                        Confirm
                                    </div>
                                </div>


                            </div>
                        ) : (
                            <div className="p-5">
                                <p className="text-center space-y-2 font-semibold">Changes Not To Be Made: </p>
                                <p className="text-center ">Changes won't be made and the old dates will remain as it is.</p>
                                <div className="flex">
                                    <div>
                                        <p className="font-semibold">Start Date: </p>
                                        <p className="font-semibold">End Date:</p>
                                    </div>
                                    <div>
                                        <p>{log?.oldStartDate} </p>
                                        <p>{log?.oldEndDate}</p>

                                    </div>
                                </div>
                                <p className="font-semibold">Action By: <span className="italic font-normal">{users.find((t) => t.id === selectedUser?.id)?.name}</span></p>
                                <p className="font-semibold">Message:</p>
                                <textarea rows="5" className="border w-full"></textarea>

                                <div className="w-full flex justify-end gap-1">
                                    <div className="bg-gray-400 px-2 text-white cursor-default" onClick={() => { setLogAction(""); setLog(null); }}>
                                        Cancel
                                    </div>
                                    <div className="bg-green-600 px-2 text-white cursor-default">
                                        Confirm
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <h2 className="font-semibold text-lg">Reschedule Logs</h2>
            <div className="p-4 bg-white rounded-xl space-y-4">
                {/* <!-- Single Reschedule Log --> */}

                {resLogs.map((log) => (
                    <div className="border border-dashed rounded-lg">
                        <div className="flex items-center justify-center p-2">
                            <p className={`capitalize rounded-full w-fit text-center px-2  ${log.status === "rejected" ?
                                "bg-red-200 text-red-700" : log.status === "accepted" ? "bg-green-200 text-green-700" : "bg-amber-200 text-amber-700"}`}>{log.status}</p>
                        </div>

                        <div className="relative  flex items-start justify-around rounded-lg p-2 ">
                            <div className="flex-1">
                                <p><span className="font-semibold" >Date: </span> <span>{log.createdAt}</span></p>
                                <p><span className="font-semibold">Initiated By:</span> <span>{users.find((user) => user?.id === log?.requestedById)?.name}</span></p>
                                <p><span className="font-semibold">Message:</span> <span>{log.reason}</span></p>
                            </div>
                            <div className="mr-2 absolute right-8/12 top-1/3">
                                <AiOutlineArrowRight />
                            </div>
                            <div className="flex-1 flex flex-col items-start justify-center">

                                <p className="font-semibold">Changes </p>
                                <p><span className="font-semibold">Old Date</span> <span>{log.oldStartDate} - {log.oldEndDate}</span></p>
                                <p><span className="font-semibold">New Date </span><span>{log.newStartDate} - {log.newEndDate}</span></p>

                            </div>
                            <div className="mr-2 absolute left-[93vh] top-1/3">
                                <AiOutlineArrowRight />
                            </div>
                            <div className="flex-1 items-start">
                                <p><span className="font-semibold">Date: </span><span>{log.actionDate ? log.actionDate : "xxxx-xx-xx"}</span></p>
                                {log.requestedById !== selectedUser?.id ? (
                                    <div className="flex space-x-3">
                                        <p className="font-semibold">Action: </p>
                                        <div className="border rounded bg-green-600 cursor-pointer hover:bg-green-500 text-white px-2" onClick={() => { setLogAction("accepted"); setLog(log); }}>
                                            Accept
                                        </div>
                                        <div className="border rounded cursor-pointer hover:bg-red-500 bg-red-600 text-white px-2" onClick={() => { setLogAction("rejected"); setLog(log) }}>
                                            Decline
                                        </div>
                                    </div>
                                ) : (
                                    <p><span className="font-semibold">Action By:</span> <span>{log.actionBy ? users.find((user) => user?.id === log?.actionBy)?.name : "-------"}</span></p>
                                )}

                                <p><span className="font-semibold">Message:</span> <span>{log.actionMesg ? log.actionMesg : "-------"}</span></p>
                            </div>
                        </div>
                        <div className={`rounded-b-lg text-center ${log.status === "rejected" ?
                            "bg-red-200 text-red-700" : log.status === "accepted" ? "bg-green-200 text-green-700" : "bg-amber-200 text-amber-700"}`}>
                            <p>{log.status === "accepted" ? "The New Changes Are Updated and Kept" : log.status === "pending" ? "Waiting for the Action" : "Was Rejected and The Old Changes Were Kept"}</p>
                        </div>
                    </div>


                ))}
            </div>
        </div >
    )
}

export default RescheduleLog



