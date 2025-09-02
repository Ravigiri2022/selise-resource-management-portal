import { useState } from "react";
import TaskTable from "../components/TaskTable";
import { useTasks } from "../context/TaskContext";
const tabs = ["Tasks", "Calander", "Stats"];

const ManagerDashboard = () => {
    const [activeTab, setActiveTab] = useState<string>(tabs[0]);
    const { getTasksByManager } = useTasks();
    const tasks = getTasksByManager(4);
    return (
        <div className="w-full  flex">
            <div className="w-1/6 flex flex-col shadow-lg h-screen  p-1">
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
            <div>
                {/* Tab Contents */}
                {activeTab === "Tasks" && (
                    <div>
                        <TaskTable data={tasks} />
                    </div>
                )}
                {activeTab === "Calander" && (
                    <div>
                        2
                    </div>
                )}
                {activeTab === "Stats" && (
                    <div>
                        3
                    </div>
                )}
            </div>


        </div>
    )
}

export default ManagerDashboard