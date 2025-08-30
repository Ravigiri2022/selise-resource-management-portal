import { AiOutlineClose } from "react-icons/ai";
import { useUsers } from "../context/UserProvider"
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import ProfileCircle from "./ProfileCircle";
import { AiFillPlusCircle } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import TextareaAutosize from "react-textarea-autosize";
import { AiOutlineLink } from "react-icons/ai";
import { AiOutlineGithub } from "react-icons/ai";



interface AddTaskPopopProps {
    onClose: () => void;
}

interface FormValues {
    title: string;
    desc: string;
    assignedTo: { id: number, name: string }[];
    startDate: string;
    endDate: string;
    priority: string;
    miniTasks: { task: string }[];
    pdfLink: string;
    githubLink: string;

}

const AddTask: React.FC<AddTaskPopopProps> = ({ onClose }) => {
    const { users } = useUsers();
    const { register, handleSubmit, control, reset } = useForm<FormValues>({
        defaultValues: {
            assignedTo: [],
            miniTasks: []
        },
    });

    // const { fields: miniTasks, append: add, remove } = useFieldArray({
    //     control,
    //     name: "miniTasks",
    // });
    const { fields: userFields, append: addUser, remove: removeUser } = useFieldArray({
        control, name: "assignedTo"
    })

    const { fields: miniTasksFields, append: addMiniTask, remove: removeMiniTask } = useFieldArray({
        control,
        name: "miniTasks"
    })

    const onSubmit = async (data: FormValues) => {
        console.log(data);
    }

    const [showDropDown, setShowDropDown] = useState(false);

    const isUserSelected = (id: string) => userFields.some((field) => field.id === id);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="relative bg-white rounded-lg max-h-[80%] w-1/2 overflow-x-scroll shadow-lg p-6">
                <h2 className="text-2xl font-sans font-bold mb-4 p-3">Add Task: </h2>
                <div className="absolute top-0 right-0 pr-9 pt-7 text-xl cursor-pointer" onClick={onClose}>
                    <AiOutlineClose />
                </div>

                <div className="flex w-[100%] h-[93%]">
                    <div className="w-full">
                        {/* Left side div of the form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <input {...register("title", { required: true })}
                                placeholder="Title"
                                className="border font-serif text-l font-bold text-center p-2 rounded w-full"
                            />
                            <TextareaAutosize {...register("desc")}
                                placeholder="Description"
                                className="border font-serif text-m p-2 rounded w-full"
                                minRows={3}
                            />

                            <div className="relative max-w-full">
                                <label className="block text-sm font-sans pl-2 pb-1">Asigned to:  </label>
                                <div className="flex items-center justify-around min-h-18 px-2 border border-dashed ">
                                    <p className="font-sans font-bold text-sm mr-2">
                                        Users:
                                    </p>

                                    <div className="flex space-x-1  max-w-[] overflow-scroll p-2 flex-1">
                                        {userFields.map((field, index) => (
                                            <div
                                                key={field.id}
                                                className="relative flex items-center gap-2 px-2 py-1 rounded-full">
                                                <div className="group">
                                                    <span className="absolute z-10 hidden group-hover:block bg-white whitespace-nowrap p-0.5 rounded shadow-lg top-[-10px]">{field.name} </span>
                                                    <ProfileCircle name={field.name} colorHex="#F56565" size={40} />
                                                </div>

                                                <button className="text-gray-500 z-0 p-0.5 bg-white rounded-full border absolute right-1 cursor-pointer hover:text-red-500 top-0" onClick={() => removeUser(index)}>
                                                    <AiOutlineDelete />

                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="relative right-0 ">
                                        <button
                                            type="button"
                                            onClick={() => setShowDropDown(!showDropDown)}
                                            className=" bg-blue-500 text-3xl text-white rounded-full flex items-center hover:bg-blue-300 cursor-pointer">
                                            <AiFillPlusCircle />

                                        </button>

                                        {showDropDown && (
                                            <div className="absolute right-0 z-10 mt-1 w-48 bg-white border rounded shadow">
                                                {
                                                    users.map((user) => (
                                                        <div key={user.id} className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${isUserSelected(user.id) ? "opacity-50 cursor-not-allowed" : ""}`}
                                                            onClick={() => {
                                                                if (!isUserSelected(user.id)) {
                                                                    addUser({ id: user.id, name: user.name });
                                                                    setShowDropDown(false);
                                                                }
                                                            }}>
                                                            {user.name}

                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                            <div className="flex gap-2 items-center ">
                                <div className="w-full">
                                    <h2 className="font-mono text-sm pl-2 mb-1">Start date: </h2>
                                    <input type="date" {...register("startDate", { required: true })} className="border p-2 rounded w-full" />

                                </div>
                                <div className="w-full">
                                    <h2 className="font-mono text-sm pl-2 mb-1">End Date :</h2>
                                    <input type="date" {...register("endDate", { required: true })} className="border p-2 rounded w-full" />

                                </div>
                            </div>
                            <div>
                                <p className="font-mono text-sm pl-2 mb-1: ">Priority :</p>
                                <select {...register("priority")} className="border p-2 rounded w-full">
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>


                            {/* miniTasks */}
                            <div className="border border-dotted p-3">
                                <h1 className="mb-2 font-mono text-sm">Mini Tasks: </h1>
                                {miniTasksFields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-2 mb-2">
                                        <p>·</p>
                                        <input {...register(`miniTasks.${index}.task` as const, { required: true })}
                                            placeholder={`Mini Task ${index + 1}`}
                                            className="border p-2 rounded flex-1" />
                                        <button type="button" onClick={() => removeMiniTask(index)} className="text-red-500 text-lg hover:text-red-300">
                                            <AiOutlineDelete />
                                        </button>
                                    </div>
                                ))}

                                <button type="button" onClick={() => addMiniTask({ task: "" })}
                                    className="text-blue-500"> + Add Mini Task
                                </button>
                            </div>
                            <div className="flex border p-2 rounded w-full items-center space-x-2">
                                <AiOutlineLink />
                                <input {...register("pdfLink")}
                                    placeholder="PDF Link"
                                    className="border-0 focus:outline-none font-mono text-sm" />
                            </div>
                            <div className="flex border p-2 rounded w-full items-center space-x-2">
                                <AiOutlineGithub />
                                <input {...register("githubLink")}
                                    placeholder="Github Link"
                                    className="border-0  focus:outline-none font-mono text-sm" />
                            </div>

                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Submit</button>
                        </form>
                    </div>

                </div>



            </div >

        </div >
    )
}

export default AddTask