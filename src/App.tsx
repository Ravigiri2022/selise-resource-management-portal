import React from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
// import EmployeeDashboard from './pages/EmployeeDashboard';
// import TaskDetails from './pages/TaskDetails';

function App() {
  return (
    <>
      <nav className="bg-gray-200 p-4">
        <Link to="/">Manager</Link> | <Link to="/employee">Employee</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/task/:id" element={<TaskDetails />} /> */}
      </Routes>
    </>
  );
}

export default App;
