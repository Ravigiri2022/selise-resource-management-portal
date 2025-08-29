import { useState } from 'react';
import { useUsers } from '../context/UserProvider'
import AddTask from './AddTask';

export const Navbar = () => {
    const { selectedUser, deselectUser } = useUsers();
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const closePopop = () => {
        setIsOpened(false);
    }

    return (
        <div className='p-3  flex items-center justify-between border-b-1 select-none'>

            {isOpened && (
                <AddTask onClose={closePopop} />
            )}
            <div>
                <p className="text-4xl pl-3" style={{ fontFamily: 'Rooster, sans-sarif' }}>Resource Management Portal</p>
                <p className='font-mono text-sm pl-10 italic '>- <span className='text-emerald-800'>{selectedUser?.role} </span> portal</p>
            </div>
            <div className='flex space-x-5'>
                {selectedUser?.role == "manager" && (
                    <div className='p-2 border rounded-lg shadow-lg  hover:bg-gray-100 cursor-pointer' onClick={() => setIsOpened(true)}>
                        Add Task
                    </div>
                )}
                <div onClick={deselectUser} className='p-2 border rounded-lg shadow-lg hover:bg-gray-100 cursor-pointer'>
                    Logout / Change User
                </div>

            </div>
        </div>
    )
}
