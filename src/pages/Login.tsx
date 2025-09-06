import ProfileCircle from "../components/ProfileCircle";
import { useUsers } from "../context/UserProvider"

const Login = () => {
    const { users, selectUser } = useUsers();
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 px-4 sm:px-6">
            <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md">
                <p className="text-2xl sm:text-4xl mb-2 sm:mb-3 text-center" style={{ fontFamily: 'Rooster, sans-serif' }}>
                    Resource Management Portal
                </p>
                <h1 className="text-lg sm:text-2xl font-semibold text-center mb-4 sm:mb-6">
                    Select a User:
                </h1>
                <div className="space-y-2 sm:space-y-4 w-full">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="p-3 sm:p-4 relative border rounded-xl shadow-sm hover:shadow-md cursor-pointer transition bg-gray-50 hover:bg-gray-100 select-none"
                            onClick={() => selectUser(user)}
                        >
                            <span className={`absolute top-1 right-1 text-xs sm:text-sm font-semibold px-2 py-1 rounded-full ${user.role !== "manager" ? "bg-indigo-100 text-indigo-800" : "bg-red-100 text-red-800"
                                } `}>
                                {user.role}
                            </span>
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <ProfileCircle
                                    name={user.name}
                                    colorHex={user.colorHex}
                                    size={30} // smaller on mobile
                                />
                                <div className="truncate">
                                    <h2 className="text-sm sm:text-lg font-medium truncate">{user.name}</h2>
                                    <p className="text-xs sm:text-sm text-gray-600 truncate">~ {user.jobTitle}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Login;
