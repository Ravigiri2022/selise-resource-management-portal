// import React, { useState } from 'react';
// // import { useTaskContext } from '../context/TaskContext';
// // import TaskList from '../components/TaskList';
// // import TaskFormModal from '../components/TaskFormModal';
// // import { Role, Task } from '../types';

// const Dashboard: React.FC = () => {


//     return (
//         <div>hello</div>
//     )
// }
// export default Dashboard;
// Dashboard.tsx
// Dashboard.tsx
import React from "react";
import { useUsers } from "../context/UserProvider";

export default function Dashboard() {
    const { selectedUser, deselectUser } = useUsers();

    if (!selectedUser) return <p>No user selected!</p>;

    return (
        <div>
            <h1>Welcome, {selectedUser.name}</h1>
            <p>Role: {selectedUser.role}</p>
            <button onClick={deselectUser}>Logout / Change User</button>
        </div>
    );
}
