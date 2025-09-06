import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Task, resLog } from "../types";
import axios from "axios";
import { API_URL } from "../../config.js"

type TaskContextType = {
    tasks: Task[];
    fetchTasks: () => Promise<void>;
    // addTask: (formData: any) => Promise<void>;
    getTasksByManager: (managerId: number) => Task[];
    getTasksByEmployee: (employeeId: number) => Task[];
    resLogs: resLog[];
    getResLogsByTaskId: (taskId: number) => resLog[];
};

// eslint-disable-next-line react-refresh/only-export-components
export const TaskContext = createContext<TaskContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
    const ctx = useContext(TaskContext);
    if (!ctx) throw new Error("useTasks muct be used within a TaskProvider");
    return ctx;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [resLogs, setResLogs] = useState<resLog[]>([]);
    const fetchTasks = async () => {
        try {
            const { data } = await axios.get<Task[]>(`${API_URL}/tasks`);
            setTasks(data);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        }
    };
    const fetchResLogs = async () => {
        try {
            const { data } = await axios.get<resLog[]>(`${API_URL}/rescheduleLogs`);
            setResLogs(data);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        }
    };


    //helpers
    const getTasksByManager = (managerId: number) => tasks.filter((t) => Number(t.assignedBy) === Number(managerId));
    const getTasksByEmployee = (employeeId: number) => tasks.filter((t) => Number(t.assignedTo) === Number(employeeId));

    //Log helpers
    const getResLogsByTaskId = (taskId: number) => resLogs.filter((t) => t.taskId === taskId);

    useEffect(() => {
        fetchTasks();
        fetchResLogs();
    }, []);

    return (
        <TaskContext.Provider
            value={{
                tasks,
                fetchTasks,
                getTasksByEmployee,
                getTasksByManager,
                resLogs,
                getResLogsByTaskId
            }}
        >
            {children}
        </TaskContext.Provider>
    )
}

