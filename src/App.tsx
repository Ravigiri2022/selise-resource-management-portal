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

    //newChanges
  );
}

export default App;
