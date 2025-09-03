import type { Task } from "../types"
import { AiOutlineLeft } from "react-icons/ai";
import GanttTable from "./GanttTable";



const TaskDetails: React.FC<{ data: Task, setTask: (value: Task) => void }> = ({ data, setTask }) => {
    return (
        <div className="max-h-[90vh] h-[90vh]  p-3">
            <div className="max-h-[88vh] h-[88vh] overflow-y-auto">
                <div className="text-lg border max-w-fit mb-2 rounded-full px-2 cursor-default flex items-center justify-center" onClick={() => setTask(null)}>
                    <AiOutlineLeft /> Back
                </div>
                <div className="w-fit items-end">
                    <h2 className="pl-5 text-3xl font-bold mb-2">
                        {data.title}
                    </h2>
                    <p className="p-2">
                        <span className="mr-2 font-semibold">Status:</span><span className={`py-1 px-2 mr-2 text-white text-center rounded-full ${data.status === "done"
                            ? "bg-green-500"
                            : data.status === "in-progress"
                                ? "bg-blue-500"
                                : data.status === "reschedule" ?
                                    "bg-gray-400" : "bg-amber-700"
                            }`}> {data.status}</span>
                        <span className="mr-2 font-semibold">Priority:</span><span className={`px-2 py-1 rounded-full ${data.priority === "high"
                            ? "bg-red-500 text-white"
                            : data.priority === "medium"
                                ? "bg-yellow-400 text-white"
                                : "bg-green-400 text-white"
                            }`}> {data.priority}</span>

                    </p>
                </div>
                <div className="text-justify m-2 ">
                    <h2 className="font-semibold">Discription: </h2>
                    <div className="border rounded-lg h-[30vh] p-2">
                        {data.description}
                    </div>
                </div>
                <div>
                    <GanttTable tasks={[data]} />
                </div>
                <div className="bg-white h-fit m-2 rounded-lg p-2 border border-gray-400/50 shadow-lg">
                    <h2 className="font-semibold text-lg">Reschedule Logs</h2>
                    <div className="p-4 bg-white rounded-xl space-y-4">
                        {/* <!-- Single Reschedule Log --> */}
                        <div className="flex justify-between items-start border-b pb-3">

                            {/* <!-- Left side: Date & Time --> */}
                            <div className="text-sm text-gray-600">
                                <div className="font-medium text-gray-800">2025-09-03</div>
                                <div>10:30 AM – 12:30 PM</div>
                                <a href="#" className="text-blue-600 hover:underline text-xs">View Timeline</a>
                            </div>

                            {/* <!-- Right side: Info --> */}
                            <div className="w-2/3 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-800">Reschedule initiated by:</span>
                                    <span className="text-gray-600">Ravi Giri</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-800">Status:</span>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium 
                     bg-yellow-100 text-yellow-700">
                                        Pending Approval
                                    </span>
                                </div>
                                <div className="mt-2 text-gray-700">
                                    <span className="font-semibold">Message:</span> Need to adjust due to conflict.
                                </div>
                                <div className="mt-2 text-gray-600 text-xs">
                                    <span className="font-semibold">Old:</span> 2025-09-02 09:00 → 11:00
                                    <span className="font-semibold">New:</span> 2025-09-03 10:30 → 12:30
                                </div>
                            </div>
                        </div>

                        {/* <!-- Another log (example) --> */}
                        <div className="flex justify-between items-start border-b pb-3">
                            <div className="text-sm text-gray-600">
                                <div className="font-medium text-gray-800">2025-09-01</div>
                                <div>02:00 PM – 04:00 PM</div>
                                <a href="#" className="text-blue-600 hover:underline text-xs">View Timeline</a>
                            </div>
                            <div className="w-2/3 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-800">Reschedule initiated by:</span>
                                    <span className="text-gray-600">Manager</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-800">Status:</span>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium 
                     bg-green-100 text-green-700">
                                        Approved
                                    </span>
                                </div>
                                <div className="mt-2 text-gray-700">
                                    <span className="font-semibold">Message:</span> Adjusted due to meeting overlap.
                                </div>
                                <div className="mt-2 text-gray-600 text-xs">
                                    <span className="font-semibold">Old:</span> 2025-08-31 02:00 → 04:00
                                    <span className="font-semibold">New:</span> 2025-09-01 02:00 → 04:00
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

        </div >
    )
}

export default TaskDetails