import { useState } from "react";
import TaskTable from "../components/TaskTable";
import { useTasks } from "../context/TaskContext";
import TaskDetails from "../components/TaskDetails";
import GanttTable from "../components/GanttTable";
import type { Task } from "../types";
import EmployeeList from "../components/EmployeeList";
const tabs = ["Tasks", "Calander", "Employees"];


const ManagerDashboard = () => {
    const [activeTab, setActiveTab] = useState<string>(tabs[0]);
    const [selectedTask, setSelectedTask] = useState<Task>();
    const { getTasksByManager } = useTasks();
    const tasks = getTasksByManager(4);
    return (
        <div className="w-full flex">
            <div className="w-1/6 flex flex-col shadow-lg h-[90vh] p-1">
                {
                    tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 -mb-px  rounded border-r-2 ${activeTab === tab ? "font-bold " : "border-transparent text-gray-500 hover:text-gray-400 "
                                }`}>
                            {tab}
                        </button>
                    ))
                }
            </div>
            <div className="w-full">
                {/* Tab Contents */}
                {activeTab === "Tasks" && (
                    <div>
                        {selectedTask ? <TaskDetails setTask={(value) => setSelectedTask(value)} data={selectedTask} /> : <TaskTable data={tasks} setTask={(value) => setSelectedTask(value)} />}

                    </div>
                )}
                {activeTab === "Calander" && (
                    <div>
                        <GanttTable tasks={tasks} />
                    </div>
                )}
                {activeTab === "Employees" && (
                    <div>
                        <EmployeeList />
                    </div>
                )}
            </div>


        </div>
    )
}

export default ManagerDashboard