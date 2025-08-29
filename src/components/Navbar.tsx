import React from 'react'
import { useUsers } from '../context/UserProvider'

export const Navbar = () => {
    const { selectedUser, deselectUser } = useUsers();

    return (
        <div>
            <h1>Welcome, {selectedUser?.name}</h1>
            <p>Role: {selectedUser?.role}</p>
            <button onClick={deselectUser}>Logout / Change User</button>
        </div>
    )
}
