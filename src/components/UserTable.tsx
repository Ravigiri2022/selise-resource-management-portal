import React, { useState } from "react";
import type { User } from "../types";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import ProfileCircle from "./ProfileCircle";

const UserTable: React.FC<{ data: User[]; setUser?: (user: User) => void }> = ({
    data,
    setUser,
}) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="p-4 w-full">
            {/* Header with collapse */}
            <div
                className="flex justify-between items-center bg-gray-100 rounded-lg px-4 py-2 cursor-pointer shadow-sm"
                onClick={() => setCollapsed(!collapsed)}
            >
                <h2 className="font-semibold text-lg">👥 Employees</h2>
                <button className="flex items-center justify-center text-black rounded-full w-7 h-7 hover:text-gray-500 border">
                    {collapsed ? <AiOutlineDown /> : <AiOutlineUp />}
                </button>
            </div>

            {/* Table */}
            {!collapsed && (
                <table className="min-w-full border-t border-gray-300 mt-2 select-none">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left border-b">ID</th>
                            <th className="px-4 py-2 text-left border-b">Name</th>
                            <th className="px-4 py-2 text-left border-b">Role</th>
                            <th className="px-4 py-2 text-left border-b">Job Title</th>
                            <th className="px-4 py-2 text-left border-b">Color</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((user) => (
                            <tr
                                key={user.id}
                                className="hover:bg-gray-100 cursor-pointer"
                                onClick={() => setUser?.(user)}
                            >
                                <td className="px-4 py-2 border-t">{user.id}</td>
                                <td className="px-4 py-2 border-t flex items-center gap-2">
                                    <ProfileCircle
                                        name={user.name}
                                        colorHex={user.colorHex}
                                        size={32}
                                    />
                                    <span>{user.name}</span>
                                </td>
                                <td className="px-4 py-2 border-t">
                                    <span className="px-2 py-1 rounded-full text-white bg-blue-500">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-2 border-t">{user.jobTitle}</td>
                                <td className="px-4 py-2 border-t">
                                    <div
                                        className="w-6 h-6 rounded-full border"
                                        style={{ backgroundColor: user.colorHex }}
                                    ></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserTable;
