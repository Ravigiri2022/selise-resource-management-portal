import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Task } from "../types";
import axios from "axios";

type TaskContextType = {
    tasks: Task[]
    fetchTasks: () => Promise<void>;
    // addTask: (formData: any) => Promise<void>;
    getTasksByManager: (managerId: number) => Task[];
    getTasksByEmployee: (employeeId: number) => Task[];
    getProgress: (taskId: string) => number;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
    const ctx = useContext(TaskContext);
    if (!ctx) throw new Error("useTasks muct be used within a TaskProvider");
    return ctx;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const fetchTasks = async () => {
        try {
            const { data } = await axios.get<Task[]>("http://localhost:5500/tasks");
            setTasks(data);
            console.log(data);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        }
    };

    //helpers
    const getTasksByManager = (managerId: number) => tasks.filter((t) => t.assignedBy === managerId);
    const getTasksByEmployee = (employeeId: number) => tasks.filter((t) => t.assignedTo.includes(employeeId));
    const getProgress = (taskId: string) => {
        const task = tasks.find((t) => t.id === Number(taskId))
        if (!task || task.subTopics?.length === 0) return 0;
        const done = task.subTopics?.filter((s) => s.done).length;
        return Math.round((done / task.subTopics?.length) * 100);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <TaskContext.Provider
            value={{
                tasks,
                fetchTasks,
                getTasksByEmployee,
                getTasksByManager,
                getProgress,
            }}
        >
            {children}
        </TaskContext.Provider>
    )
}

