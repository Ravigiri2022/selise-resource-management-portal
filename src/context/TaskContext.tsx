import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Task, resLog } from "../types";
import { useUsers } from "./UserProvider";
import { taskService, userService } from "../services/services";
// import { API_URL } from "../../config.js"

type TaskContextType = {
    tasks: Task[];
    fetchTasks: () => Promise<void>;
    fetchResLogs: (taskId: number) => Promise<resLog[]>;
    resLogs: resLog[];
    selectedTask: Task | null;
    setSelectedTaskFn: (task: Task | null) => void;
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
    const { selectedUser } = useUsers();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [resLogs, setResLogs] = useState<resLog[]>([]);
    const setSelectedTaskFn = (task: Task | null) => {
        setSelectedTask(task);
    }
    const fetchTasks = async () => {
        try {
            const data = await userService.getTaskById(selectedUser?.id);
            // console.log(data, selectedUser?.id);
            setTasks(data);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        }
    };
    const fetchResLogs = async (taskId: number) => {
        try {
            const data = await taskService.getResLogsById(taskId);
            setResLogs(data);
            // console.log("log", data);

            return data
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        }
    };

    useEffect(() => {
        if (selectedUser) {
            fetchTasks();
        }
    }, [selectedUser]);

    return (
        <TaskContext.Provider
            value={{
                tasks,
                fetchTasks,
                resLogs,
                fetchResLogs,
                setSelectedTaskFn,
                selectedTask
            }}
        >
            {children}
        </TaskContext.Provider>
    )
}

