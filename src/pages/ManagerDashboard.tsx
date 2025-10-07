import { useEffect, useState } from "react";
import TaskTable from "../components/TaskTable";
import { useTasks } from "../context/TaskContext";
import TaskDetails from "../components/TaskDetails";
import GanttTable from "../components/GanttTable";
// import type { Task } from "../types";
import EmployeeList from "../components/EmployeeList";
import ProjectList from "../components/ProjectList";
import { useNavigate, useParams } from "react-router-dom";

const tabs = ["Tasks", "Gantt Chart", "Employees", "Project"];

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>(tabs[0]);
    const { tasks, selectedTask } = useTasks();
    const { tabName } = useParams(); // "tasks" or "table"



    useEffect(() => {
        console.log(tabName);
        setActiveTab(tabName);
    }, [tabName])

    return (
        <div className="w-full flex flex-col md:flex-row h-[90vh]">
            {/* Sidebar / Tabs */}
            <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible shadow-lg bg-white md:w-1/6 w-full">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        // onClick={() => setActiveTab(tab)}
                        onClick={() => navigate(`/manager/${tab}`)}
                        className={`flex-1 md:flex-none px-2 sm:px-4 py-2 text-sm sm:text-base md:text-base border-b md:border-b-0 md:border-r-2 ${activeTab === tab
                            ? "font-bold border-blue-500"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-2 sm:p-4 overflow-auto">
                {activeTab === "Tasks" && (
                    <div className="w-full">
                        {selectedTask ? (
                            <TaskDetails />
                        ) : (
                            <div className="overflow-x-auto">
                                <TaskTable />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "Gantt Chart" && (
                    <div className="overflow-x-auto">
                        <GanttTable tasks={tasks} />
                    </div>
                )}

                {activeTab === "Employees" && (
                    <div className="overflow-x-auto">
                        <EmployeeList />
                    </div>
                )}
                {activeTab === "Project" && (
                    <div className="overflow-x-auto">
                        <ProjectList />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerDashboard;
