import { useUsers } from "../context/UserProvider"
import "./Toast.css"

const PopUpMsg = () => {
    const { toasts } = useUsers();
    return (
        <div className="toast-wrapper">
            {/* <div className="w-fit px-3 py-1 bg-white mt-5"> */}
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
            ))}
            {/* </div> */}

        </div>
    )
}

export default PopUpMsg