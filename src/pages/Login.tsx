import ProfileCircle from "../components/ProfileCircle";
import { useUsers } from "../context/UserProvider"

const Login = () => {
    const { users, selectUser } = useUsers();
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="flex items-center justify-center flex-col  bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <p className="text-4xl mb-3" style={{ fontFamily: 'Rooster, sans-sarif' }}>Resource Management Portal</p>
                <h1 className="text-2xl font-semibold text-center mb-6 font-rooster" >Select a User: </h1>
                <div className="space-y-4">
                    {users.map((user) => (
                        <div key={user.id}
                            className="p-3 pr-12 relative border rounded-xl shadow-sm hover:shadow-md cursor-pointer transition bg-gray-50 hover:bg-gray-100 select-none" onClick={() => selectUser(user)}>
                            <span className="absolute top-0.5 right-0.5 mt-1 text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">{user.role}</span>
                            <div className="flex items-center space-x-4">
                                <ProfileCircle
                                    name={user.name}
                                    colorHex={user.colorHex}
                                    size={40}
                                />

                                <div>
                                    <h2 className="text-lg font-medium  ">{user.name}</h2>
                                    <p className="text-sm text-gray-600">~ {user.jobTitle}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Login