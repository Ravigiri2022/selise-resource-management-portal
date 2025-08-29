import React, { useState } from 'react';
// import { useTaskContext } from '../context/TaskContext';
// import TaskList from '../components/TaskList';
// import TaskFormModal from '../components/TaskFormModal';
// import { Role, Task } from '../types';

const Dashboard: React.FC = () => {
    //     const { state } = useTaskContext();
    //     const [isModalOpen, setIsModalOpen] = useState(false);
    //     const [userRole, setUserRole] = useState<Role>('manager'); // Toggle between 'manager' and 'employee'

    //     const handleAddTask = (task: Task) => {
    //         // Dispatch action to add task
    //     };

    //     const handleStatusChange = (taskId: number, status: Task['status']) => {
    //         // Dispatch action to update task status
    //     };

    //     return (
    //         <div className="min-h-screen bg-gray-100">
    //             <header className="bg-blue-600 text-white p-4">
    //                 <h1 className="text-2xl font-bold">Resource Management Portal</h1>
    //                 <div className="mt-2">
    //                     <button
    //                         onClick={() => setUserRole(userRole === 'manager' ? 'employee' : 'manager')}
    //                         className="bg-gray-800 text-white px-4 py-2 rounded"
    //                     >
    //                         Switch to {userRole === 'manager' ? 'Employee' : 'Manager'} View
    //                     </button>
    //                 </div>
    //             </header>

    //             <main className="p-6">
    //                 {userRole === 'manager' ? (
    //                     <>
    //                         <div className="flex justify-between items-center mb-4">
    //                             <h2 className="text-xl font-semibold">Assigned Tasks</h2>
    //                             <button
    //                                 onClick={() => setIsModalOpen(true)}
    //                                 className="bg-green-500 text-white px-4 py-2 rounded"
    //                             >
    //                                 Add Task
    //                             </button>
    //                         </div>
    //                         <TaskList tasks={state.tasks} onStatusChange={handleStatusChange} />
    //                     </>
    //                 ) : (
    //                     <TaskList tasks={state.tasks} onStatusChange={handleStatusChange} />
    //                 )}
    //             </main>

    //             {isModalOpen && <TaskFormModal onSubmit={handleAddTask} onClose={() => setIsModalOpen(false)} />}
    //         </div>
    //     );
    // };

    return (
        <div>hello</div>
    )
}
export default Dashboard;
