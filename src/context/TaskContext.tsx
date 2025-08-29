import React, { createContext, useReducer, useContext, type ReactNode } from "react";
import type { Task } from "../types";

type TaskState = { tasks: Task[] };

type TaskAction =
    | { type: "SET_TASKS"; payload: Task[] }
    | { type: "ADD_TASK"; payload: Task }
    | { type: "UPDATE_TASK"; payload: Task }
    | { type: "DELETE_TASK"; payload: number };

const initialState: TaskState = { tasks: [] };

function taskReducer(state: TaskState, action: TaskAction): TaskState {
    switch (action.type) {
        case "SET_TASKS":
            return { ...state, tasks: action.payload };
        case "ADD_TASK":
            return { ...state, tasks: [...state.tasks, action.payload] };
        case "UPDATE_TASK":
            return {
                ...state,
                tasks: state.tasks.map(t => (t.id === action.payload.id ? action.payload : t)),
            };
        case "DELETE_TASK":
            return {
                ...state,
                tasks: state.tasks.filter(t => t.id !== action.payload),
            };
        default:
            return state;
    }
}

const TaskContext = createContext<{
    state: TaskState;
    dispatch: React.Dispatch<TaskAction>;
} | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(taskReducer, initialState);
    return <TaskContext.Provider value={{ state, dispatch }}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) throw new Error("useTaskContext must be used within TaskProvider");
    return context;
};
