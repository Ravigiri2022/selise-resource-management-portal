// src/routes.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
// import EmployeeDashboard from './pages/EmployeeDashboard';
// import TaskDetails from './pages/TaskDetails';

const AppRoutes: React.FC = () => (
    <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/task/:id" element={<TaskDetails />} /> */}
    </Routes>
);

export default AppRoutes;
