import { AiOutlineLeft } from "react-icons/ai";
import { useUsers } from "../context/UserProvider";
import type { resLog, User } from "../types";
import ProfileCircle from "./ProfileCircle";
import { useEffect, useState } from "react";
import UserTable from "./UserTable";
import GanttTable from "./GanttTable";
import { useTasks } from "../context/TaskContext";
import RescheduleLog from "./RescheduleLog";


const EmployeeList = () => {
    const { users, selectUser } = useUsers();
    const { tasks, getResLogsByTaskId } = useTasks();
    const [selected, setSelected] = useState<User>();
    const [resLogs, setResLogs] = useState<resLog[]>();
    // useEffect(() => {
    //     if (selected) {
    //         setResLogs(getResLogsByTaskId(tasks.map));
    //     }
    // }, [selected])


    return (
        <div className="p-3 w-full">
            <h2 className="text-xl font-semibold mb-2">Employees</h2>

            <div className="w-full">
                {!selected ? (
                    <div className="grid grid-cols-3 gap-2 ">
                        {users.map((user) => user.role === "employee" && (
                            <div className="">
                                <div key={user.id}
                                    className="p-3 pr-12 relative border rounded-xl shadow-sm hover:shadow-md cursor-pointer transition bg-gray-50 hover:bg-gray-100 select-none" onClick={() => setSelected(user)}>
                                    <span className="absolute top-0.5 right-0.5 mt-1 text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">{user.role}</span>
                                    <div className="flex items-center space-x-4">
                                        <ProfileCircle
                                            name={user.name}
                                            colorHex={user.colorHex}
                                            size={40}
                                        />

                                        <div>
                                            <h2 className="text-lg font-medium  ">{user.name}</h2>
                                            <p className="text-sm text-gray-600">~ {user.jobTitle}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                        )}
                    </div>
                ) : (
                    <div>
                        <div className="bg-white sticky top-0 text-lg border max-w-fit mb-2 rounded-full px-2 cursor-default flex items-center justify-center" onClick={() => setSelected(undefined)}>
                            <AiOutlineLeft /> Back
                        </div>
                        <div>
                            <GanttTable tasks={tasks.filter((task) => task.assignedTo === selected.id)} />
                        </div>

                    </div>
                )}

            </div>
        </div>
    )
}

export default EmployeeList