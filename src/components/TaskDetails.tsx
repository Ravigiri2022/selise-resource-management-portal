import type { Task } from "../types"
import { AiFillGithub, AiOutlineFilePdf, AiOutlineLeft, AiOutlineLink } from "react-icons/ai";
import GanttTable from "./GanttTable";
import { useTasks } from "../context/TaskContext";
import { useUsers } from "../context/UserProvider";
// import { AiOutlineArrowRight } from "react-icons/ai";
import RescheduleLog from "./RescheduleLog";
import ProfileCircle from "./ProfileCircle";
import { useEffect } from "react";
import { taskService } from "../services/taskService";
// import axios from "axios";




const TaskDetails: React.FC<{ data: Task, setTask: (value: Task) => void }> = ({ data, setTask }) => {
    const { getResLogsByTaskId, fetchTasks } = useTasks();
    // const { selectedUser } = useUsers();
    const resLogs = getResLogsByTaskId(data.id);
    const { users, selectedUser } = useUsers();
    const assByUser = users?.find((user) => user.id === data.assignedBy);
    const assToUser = users?.find((user) => user.id === data.assignedTo);
    const userAssignedBy = assByUser?.name
    const userAssignedTo = assToUser?.name
    // const setStatus = async () => {
    //     if (data.status === "unseen" && selectedUser?.role !== "manager") {
    //         try {
    //             const updatedTask = { ...data, status: "todo" };
    //             await taskService.update(data.id, updatedTask);
    //             fetchTasks();
    //             console.log("Task updated successfully!");
    //         } catch (error) {
    //             console.error("Error updating task:", error);
    //         }
    //     }
    // }

    useEffect(() => {
        const updateStatusIfUnseen = async () => {
            if (!data || !selectedUser) return; // wait for both

            if (data.status === "unseen" && selectedUser.role !== "manager") {
                try {
                    // const { dataz } = await axios.get<Task>("http://localhost:5500/tasks/101");
                    // console.log("HEY", dataz);


                    await taskService.updateStatus(data.id, "todo");

                    console.log("Task updated to todo!");
                    fetchTasks(); // make sure parent context updates the data
                } catch (err) {
                    console.error("Failed to update task status:", err);
                }
            }
        };

        updateStatusIfUnseen();
    }, []);

    return (
        <div className="max-h-[90vh] h-[90vh]  p-3">
            <div className="max-h-[88vh] h-[88vh] overflow-y-auto">
                <div className="bg-white sticky top-0 text-lg border max-w-fit mb-2 rounded-full px-2 cursor-default flex items-center justify-center transform transition duration-150 active:scale-85 active:text-gray-700" onClick={() => setTask(null)}>
                    <AiOutlineLeft /> Back
                </div>
                <div className="w-full items-end ">
                    <div className="flex items-center justify-between">
                        <h2 className="pl-5 text-3xl  font-bold mb-2">
                            {data.title}

                        </h2>
                        <div className="px-4 py-2 border-sm text-sm shadow-sm rounded-lg flex">
                            <div className="mr-1">
                                <p className="font-semibold">Start Date:
                                </p>
                                <p className="font-semibold">End Date:
                                </p>
                            </div>
                            <div>
                                <p>{data.startDate}</p>
                                <p>{data.endDate}</p>
                            </div>


                        </div>
                    </div>

                    <div className="p-2 flex items-center space-x-2 justify-start">
                        <span className="mr-2 font-semibold">Status:</span><span className={`py-1 capitalize cursor-default px-2 mr-2 text-center rounded-full ${data.status === "done"
                            ? "bg-green-500"
                            : data.status === "in-progress"
                                ? "text-blue-500 bg-blue-200"
                                : data.status === "reschedule" ?
                                    "text-gray-700 bg-gray-200" : "bg-amber-200 text-amber-700"
                            }`}> {data.status}</span>
                        <span className="mr-2 font-semibold">Priority:</span><span className={`px-2 capitalize cursor-default py-1 rounded-full ${data.priority === "high"
                            ? "bg-red-200 text-red-700"
                            : data.priority === "medium"
                                ? "bg-yellow-400 text-white"
                                : "bg-green-200 text-green-700"
                            }`}> {data.priority}</span>

                        <span className="font-semibold">Assigned to:</span>
                        <div className="flex items-center space-x-2 text-white px-2 pl-0 rounded-full" style={{ backgroundColor: assToUser?.colorHex }}>
                            <span className="shadow-sm rounded-full"><ProfileCircle name={userAssignedTo ?? ""} colorHex={assToUser?.colorHex ?? "#858585"} size={30} /> </span>
                            <span>{assToUser?.name}</span>
                        </div>
                        <span className="font-semibold">Assigned by:</span>
                        <div className="flex items-center space-x-2 text-white px-2 pl-0 rounded-full" style={{ backgroundColor: assToUser?.colorHex }}>
                            <span className="shadow-sm rounded-full"><ProfileCircle name={userAssignedBy ?? ""} colorHex={assByUser?.colorHex ?? "#858585"} size={30} /> </span>
                            <span>{assByUser?.name}</span>
                        </div>
                        <span>:</span>
                        {selectedUser?.role === "employee" && data.status !== "reschedule" ? (
                            <div>
                                <div className="bg-gray-300 font-semibold px-3 py-0.5 rounded-lg cursor-pointer hover:shadow-sm">
                                    Mark as In Progress
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm">
                                Waiting for the reschedule action
                            </div>
                        )}



                    </div>
                    <div className="flex items-center space-x-5">
                        <div className="flex items-center text-center justify-center space-x-1">
                            <span className="text-3xl">
                                <AiOutlineFilePdf />

                            </span>
                            <a href={data.pdfLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline font-mono italic hover:text-blue-500 text-sm">PDF Link</a>
                            <span onClick={() => {
                                navigator.clipboard.writeText(`${data.pdfLink}`);
                            }}
                                className="cursor-pointer transform transition duration-150 active:scale-65 active:text-gray-700">
                                <AiOutlineLink />
                            </span>

                        </div>

                        <div className="flex items-center text-center justify-center space-x-1">
                            <span className="text-3xl">
                                <AiFillGithub />


                            </span>
                            <a href={data.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline font-mono italic hover:text-blue-500 text-sm">PDF Link</a>
                            <span onClick={() => {
                                navigator.clipboard.writeText(`${data.githubLink}`);
                            }}
                                className="cursor-pointer transform transition duration-150 active:scale-65 active:text-gray-700">
                                <AiOutlineLink />
                            </span>

                        </div>
                    </div>
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


                <div>
                    <RescheduleLog resLogs={resLogs} />
                </div>
            </div >

        </div >
    )
}

export default TaskDetails