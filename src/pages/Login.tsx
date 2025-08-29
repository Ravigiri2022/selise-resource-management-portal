import { useUsers } from "../context/UserProvider"

const Login = () => {
    const { users } = useUsers();
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Select a User to sellect</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.role}

                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Login