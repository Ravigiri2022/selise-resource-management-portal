import { Navigate, Route, Routes } from 'react-router-dom';
import EmployeeDashboard from './pages/EmployeeDashboard';
import { useUsers } from './context/UserProvider';
import ManagerDashboard from './pages/ManagerDashboard';
import type { JSX } from 'react';
import Login from './pages/Login';

function ProtectedRoute({ children, allowedRole }: { children: JSX.Element; allowedRole: string }) {
    const { selectedUser } = useUsers();

    if (!selectedUser) return <Navigate to="/login" replace />;
    if (selectedUser.role !== allowedRole) return <Navigate to="/" replace />;

    return children;
}

export default function AppRoutes() {
    const { selectedUser } = useUsers();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    !selectedUser ? (
                        <Navigate to="/login" replace />
                    ) : selectedUser.role === "manager" ? (
                        <Navigate to="/manager" replace />
                    ) : (
                        <Navigate to="/employee" replace />
                    )
                }
            />

            <Route path="/login" element={selectedUser ? (<Navigate to="/" replace />) : <Login />} />

            <Route
                path="/manager"
                element={
                    <ProtectedRoute allowedRole="manager">
                        <ManagerDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/employee"
                element={
                    <ProtectedRoute allowedRole="employee">
                        <EmployeeDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
