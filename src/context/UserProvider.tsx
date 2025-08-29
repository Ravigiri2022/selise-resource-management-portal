// UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types";

type UserContextType = {
    users: User[];            // all users fetched from backend
    selectedUser: User | null; // currently selected user
    selectUser: (user: User) => void; // set selected user
    deselectUser: () => void;          // clear selected user
    loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const API_URL = "http://localhost:5500/users";

    // Fetch all users once
    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .finally(() => setLoading(false));
    }, []);

    // Select a user
    const selectUser = (user: User) => setSelectedUser(user);

    // Deselect user (log out)
    const deselectUser = () => setSelectedUser(null);

    return (
        <UserContext.Provider
            value={{ users, selectedUser, selectUser, deselectUser, loading }}
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
