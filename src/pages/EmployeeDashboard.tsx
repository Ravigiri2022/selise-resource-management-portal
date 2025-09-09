import { useState } from "react";
import TaskTable from "../components/TaskTable";
import { useTasks } from "../context/TaskContext";
import TaskDetails from "../components/TaskDetails";
import GanttTable from "../components/GanttTable";
import type { Task } from "../types";
// import { useUsers } from "../context/UserProvider";
import EmployeeWorkLoad from "../components/EmployeeWorkLoad";

const tabs = ["Tasks", "Employees"];

const EmployeeDashboard = () => {
    const [activeTab, setActiveTab] = useState<string>(tabs[0]);
    const [selectedTask, setSelectedTask] = useState<Task | null>();
    const { tasks } = useTasks();


    return (
        <div className="w-full flex flex-col md:flex-row h-[90vh]">
            <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible shadow-lg bg-white md:w-1/6 w-full">
                {
                    tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 md:flex-none px-2 sm:px-4 py-2 text-sm sm:text-base md:text-base border-b md:border-b-0 md:border-r-2 ${activeTab === tab
                                ? "font-bold border-blue-500"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}>
                            {tab}
                        </button>
                    ))
                }
            </div>
            <div className="flex-1 p-2 sm:p-4 overflow-auto">
                {/* Tab Contents */}
                {activeTab === "Tasks" && (
                    <div>
                        {selectedTask ?
                            <TaskDetails setTask={(value) => setSelectedTask(value)} task={selectedTask} /> :
                            <TaskTable data={tasks} setTask={(value) => setSelectedTask(value)} />}

                    </div>
                )}
                {activeTab === "Calander" && (
                    <div>
                        <GanttTable tasks={tasks} />
                    </div>
                )}
                {activeTab === "Employees" && (
                    <div>
                        <EmployeeWorkLoad tasks={tasks} />
                    </div>
                )}
            </div>


        </div>
    )
}

export default EmployeeDashboard