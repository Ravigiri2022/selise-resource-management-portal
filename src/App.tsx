// import { Routes, Route, Link } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';
// import EmployeeDashboard from './pages/EmployeeDashboard';
// import TaskDetails from './pages/TaskDetails';
import { useUsers } from './context/UserProvider'
import { Navbar } from './components/Navbar';
import AppRoutes from './routes';
import PopUpMsg from './components/PopUpMsg';



function App() {
  const { selectedUser, toasts } = useUsers();

  return (
    <div className='flex flex-col min-h-screen'>
      {toasts.length > 0 && <PopUpMsg />}
      {selectedUser && (
        <Navbar />
      )}
      <main className='flex-1'>
        <AppRoutes />
      </main>
    </div>

    // <AppRoutes />
  );
}

export default App;
