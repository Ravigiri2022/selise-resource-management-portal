import { AiOutlineClose } from "react-icons/ai";
interface AddTaskPopopProps {
    onClose: () => void;
}

const AddTask: React.FC<AddTaskPopopProps> = ({ onClose }) => {

    return (
        <div className="fixed inset-0 flex  items-center justify-center bg-black/50">
            <div className="relative bg-white rounded-lg w-[80%] h-[80%] shadow-lg p-6">
                <h2 className="text-2xl font-mono font-bold mb-4 p-3">Add Task: </h2>
                <div className="absolute top-0 right-0 pr-9 pt-8 text-xl cursor-pointer" onClick={onClose}>
                    <AiOutlineClose />
                </div>

                <div className="flex w-[100%] h-[93%]">
                    <div className="flex-1">

                    </div>
                    <div className="flex-1">

                    </div>
                </div>



            </div>

        </div>
    )
}

export default AddTask