// UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types";
type toast = {
    id: number, type: string, message: string
}

type UserContextType = {
    users: User[];            // all users fetched from backend
    selectedUser: User | null; // currently selected user
    selectUser: (user: User) => void; // set selected user
    deselectUser: () => void;          // clear selected user
    loading: boolean;
    toasts: toast[];
    addToast: (type: string, message: string, duration: number) => number;
    removeToast: (id: number) => void;

};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [toasts, setToasts] = useState<toast[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(() => {
        const saved = localStorage.getItem("selectedUser");
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(true);

    const API_URL = "http://localhost:5500/users";  //<-------------url

    // Fetch all users once
    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .finally(() => setLoading(false));
    }, []);

    // Select a user
    const selectUser = (user: User) => {
        setSelectedUser(user);
        localStorage.setItem("selectedUser", JSON.stringify(user));
    };

    // Deselect user (log out)
    const deselectUser = () => {
        setSelectedUser(null);
        localStorage.removeItem("selectedUser");
    };

    const addToast = (type: string, message: string, duration = 2000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message }]);
        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));

            }, duration)
        }
        return id;
    }

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }

    return (
        <UserContext.Provider
            value={{ users, selectedUser, selectUser, deselectUser, loading, toasts, addToast, removeToast }}
        >
            {children}
        </UserContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUsers must be used inside UserProvider");
    return context;
};
