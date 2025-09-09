import { useState } from 'react';
import { useUsers } from '../context/UserProvider';
import AddTask from './AddTask';
import { AiOutlinePlus } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import { useTasks } from '../context/TaskContext';

export const Navbar = () => {
    const { selectedUser, deselectUser } = useUsers();
    const { setSelectedTaskFn } = useTasks();
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const closePopop = () => setIsOpened(false);

    return (
        <div className='p-3 sm:px-6 flex items-center justify-between border-b select-none h-auto sm:h-[10vh]'>

            {isOpened && <AddTask onClose={closePopop} />}

            {/* Logo / Title */}
            <div className=' items-center space-x-2 sm:space-x-4 flex-1 min-w-0'>
                <p className="text-2xl sm:text-4xl truncate" style={{ fontFamily: 'Rooster, sans-serif' }}>
                    Resource Management Portal
                </p>
                <p className='font-mono capitalize text-xs sm:text-sm italic truncate'>
                    ~ <span className={`${selectedUser?.role === "manager" ? "text-red-800 font-semibold" : "text-indigo-800 font-semibold"}`}>{selectedUser?.role}</span> portal
                </p>
            </div>

            {/* Action Buttons */}
            <div className='flex items-center space-x-2 sm:space-x-3 ml-2'>
                {selectedUser?.role === "manager" && (
                    <>
                        {/* Mobile Icon */}
                        <button
                            className='p-2 border rounded-lg shadow-lg hover:bg-gray-100 sm:hidden'
                            onClick={() => setIsOpened(true)}
                        >
                            <AiOutlinePlus size={20} />
                        </button>
                        {/* Desktop Text */}
                        <button
                            className='hidden sm:inline-flex p-2 sm:px-3 sm:py-2 border rounded-lg shadow-lg hover:bg-gray-100'
                            onClick={() => setIsOpened(true)}
                        >
                            Add Task
                        </button>
                    </>
                )}
                {/* Logout / Change User */}
                {/* Mobile Icon */}
                <button
                    onClick={deselectUser}
                    className='p-2 border rounded-lg shadow-lg hover:bg-gray-100 sm:hidden'
                >
                    <FiLogOut size={20} />
                </button>
                {/* Desktop Text */}
                <button
                    onClick={() => { deselectUser(); setSelectedTaskFn(null); }}
                    className='hidden sm:inline-flex p-2 sm:px-3 sm:py-2 border rounded-lg shadow-lg hover:bg-gray-100'
                >
                    Logout / Change User
                </button>
            </div>

        </div>
    )
}
