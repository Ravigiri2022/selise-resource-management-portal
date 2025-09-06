import { AiOutlineLeft } from "react-icons/ai";
import { useUsers } from "../context/UserProvider";
import type { User } from "../types";
import ProfileCircle from "./ProfileCircle";
import { useState } from "react";
import GanttTable from "./GanttTable";
import { useTasks } from "../context/TaskContext";

const EmployeeList = () => {
    const { users } = useUsers();
    const { tasks } = useTasks();
    const [selected, setSelected] = useState<User>();

    return (
        <div className="p-3 w-full">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">Employees</h2>

            <div className="w-full">
                {!selected ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {users.map((user) =>
                            user.role === "employee" ? (
                                <div key={user.id}>
                                    <div
                                        className="p-3 pr-12 relative border rounded-xl shadow-sm hover:shadow-md cursor-pointer transition bg-gray-50 hover:bg-gray-100 select-none"
                                        onClick={() => setSelected(user)}
                                    >
                                        <span className="absolute top-0.5 right-0.5 mt-1 text-[0.6rem] sm:text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                            {user.role}
                                        </span>
                                        <div className="flex items-center space-x-3 sm:space-x-4">
                                            <ProfileCircle name={user.name} colorHex={user.colorHex} size={32} />
                                            <div className="overflow-hidden">
                                                <h2 className="text-sm sm:text-lg font-medium truncate">{user.name}</h2>
                                                <p className="text-[0.65rem] sm:text-sm text-gray-600 truncate">~ {user.jobTitle}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        )}
                    </div>
                ) : (
                    <div>
                        <div
                            className="bg-white sticky top-0 text-sm sm:text-lg border max-w-fit mb-2 rounded-full px-2 sm:px-3 cursor-pointer flex items-center justify-center hover:shadow-sm transition transform active:scale-95"
                            onClick={() => setSelected(undefined)}
                        >
                            <AiOutlineLeft className="mr-1" /> Back
                        </div>
                        <div className="overflow-x-auto">
                            <GanttTable tasks={tasks.filter((task) => task.assignedTo === Number(selected.id))} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeList;
