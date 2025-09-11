import { AiOutlineClose, AiFillPlusCircle, AiOutlineDelete, AiOutlineLink, AiOutlineGithub } from "react-icons/ai";
import { useUsers } from "../context/UserProvider";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import ProfileCircle from "./ProfileCircle";
import TextareaAutosize from "react-textarea-autosize";
import type { FormValues, Project } from "../types";
import { projectService, taskService } from "../services/services";
import { useTasks } from "../context/TaskContext";
import GanttTable from "./GanttTable";

interface AddTaskPopopProps {
    onClose: () => void;
}

const AddTask: React.FC<AddTaskPopopProps> = ({ onClose }) => {
    // const [tasks, setTasks] = useState<Task[]>([]);
    const { users, selectedUser, addToast, removeToast } = useUsers();
    const { register, handleSubmit, control, reset } = useForm<FormValues>({
        defaultValues: {
            assignedTo: [],
            miniTasks: [],
        },
    });
    const { fetchTasks, fetchTasksById, showTasks } = useTasks();
    const { fields: userFields, append: addUser, remove: removeUser } = useFieldArray({
        control,
        name: "assignedTo",
    });
    const formatDateWithTime = (date: string, isEnd: boolean = false) => {
        if (!date) return null;
        return isEnd ? `${date} 23:59` : `${date} 00:00`;
    };

    const loadingIdRef = useRef<number>(0);

    const onSubmit = async (data: FormValues) => {
        try {
            if (!selectedProject) {
                addToast("error", "Please select a project", 2000);
                return;
            }
            loadingIdRef.current = Number(addToast("loading", "Loading ...", 0))
            const payload = {
                task: {
                    title: data.title,
                    description: data.desc,
                    assignedBy: Number(selectedUser?.id),
                    assignedTo: Number(data.assignedTo[0].userId),
                    startDate: formatDateWithTime(data.startDate, false),
                    endDate: formatDateWithTime(data.endDate, true),
                    priority: data.priority,
                    pdfLink: data.pdfLink,
                    githubLink: data.githubLink,
                    projectId: selectedProject?.id,
                }
            };

            const response = await taskService.create(payload);
            if (response) {
                console.log("Task created:", response);
                addToast("success", `Task ${data.title} Created`, 2000)
                onClose();
                reset();
                fetchTasks();
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error);
            if (error.response) {
                addToast("error", error.response.data.errors, 2000);
            }
            else if (error.request) {
                addToast("error", "No response", 2000);
            }
            else {
                addToast("error", `Error ${error.message}`, 2000);

            }
            // addToast("error", `${saved}`, 2000);
        } finally {
            if (loadingIdRef.current) {
                removeToast(loadingIdRef.current);
                loadingIdRef.current = 0;
            }
        }
    };

    const [showDropDown, setShowDropDown] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [showProjectDropDown, setShowProjectDropDown] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await projectService.getAll();
                console.log(data);
                setProjects(data);
            } catch (err) {
                console.error(err);
            }

        }
        fetchProject();
    }, [])
    const isUserSelected = (id: number) => userFields.some((field) => field.userId === id);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 px-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
                {/* Close Button */}
                <button
                    onClick={() => { onClose(); fetchTasksById(null); }}

                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl transition"
                >
                    <AiOutlineClose />
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Task</h2>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit, () => addToast("error", "Needs All Fields", 2000))} className="space-y-5">
                    {/* Title */}
                    <input
                        {...register("title", { required: true })}
                        placeholder="Task Title"
                        className="border border-gray-300 focus:ring-2 focus:ring-blue-400 font-medium text-lg p-3 rounded-lg w-full transition"
                    />

                    {/* Description */}
                    <TextareaAutosize
                        {...register("desc")}
                        placeholder="Description"
                        className="border border-gray-300 focus:ring-2 focus:ring-blue-400 p-3 rounded-lg w-full text-sm"
                        minRows={3}
                    />


                    {/* Assigned To */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Assigned To</label>
                        <div className="flex flex-wrap items-center gap-3 border border-dashed border-gray-400 rounded-lg p-3">
                            {userFields.map((field, index) => (
                                <div key={field.id} className="relative group">
                                    <ProfileCircle
                                        name={field.name}
                                        colorHex={users.find((u) => u.id === Number(field.userId))?.colorHex || "#F56565"}
                                        size={40}
                                    />
                                    <button
                                        type="button"
                                        className="absolute -top-2 -right-2 bg-white text-gray-500 hover:text-red-500 rounded-full border shadow p-1"
                                        onClick={() => { removeUser(index); fetchTasksById(null); }}
                                    >
                                        <AiOutlineDelete />
                                    </button>
                                    <span className="absolute hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 -bottom-7 left-1/2 transform -translate-x-1/2">
                                        {field.name}
                                    </span>

                                </div>
                            ))}
                            {showTasks[0] ? (
                                <div className="w-full">
                                    <GanttTable tasks={showTasks} />
                                </div>) :
                                ""
                            }



                            {/* Add user dropdown */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowDropDown(!showDropDown)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 text-xl transition"
                                >
                                    <AiFillPlusCircle />
                                </button>

                                {showDropDown && (
                                    <div className="absolute top-12 left-0 w-48 bg-white border rounded-lg shadow-lg z-20">
                                        {users.map((user) => (
                                            <div
                                                key={user.id}
                                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${isUserSelected(user.id) ? "opacity-50 cursor-not-allowed" : ""
                                                    }`}
                                                onClick={() => {
                                                    if (!isUserSelected(user.id)) {
                                                        addUser({ userId: user.id, name: user.name });
                                                        setShowDropDown(false);
                                                        fetchTasksById(user.id);
                                                    }
                                                }}
                                            >
                                                {user.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="relative border border-gray-200 rounded-lg p-3 flex items-center justify-center"
                        onClick={() => { setShowProjectDropDown(!showProjectDropDown) }}>
                        <p>{selectedProject ? selectedProject.name : "Select a Project"}</p>
                        {showProjectDropDown && (
                            <div className="absolute top-12 left-0 w-48 bg-white border rounded-lg shadow-lg z-20">
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100`}
                                        onClick={() => {
                                            {
                                                setSelectedProject(project);
                                                setShowProjectDropDown(false);
                                            }
                                        }}
                                    >
                                        {project.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold block mb-1">Start Date</label>
                            <input
                                type="date"
                                {...register("startDate", { required: true })}
                                className="border border-gray-300 focus:ring-2 focus:ring-blue-400 p-2 rounded-lg w-full"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold block mb-1">End Date</label>
                            <input
                                type="date"
                                {...register("endDate", { required: true })}
                                className="border border-gray-300 focus:ring-2 focus:ring-blue-400 p-2 rounded-lg w-full"
                            />
                        </div>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="text-sm font-semibold block mb-1">Priority</label>
                        <select
                            {...register("priority")}
                            className="border border-gray-300 focus:ring-2 focus:ring-blue-400 p-2 rounded-lg w-full"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    {/* Links */}
                    <div className="flex items-center border border-gray-300 rounded-lg p-2 gap-2">
                        <AiOutlineLink className="text-gray-500" />
                        <input
                            {...register("pdfLink")}
                            placeholder="PDF Link"
                            className="flex-1 border-0 focus:outline-none text-sm"
                        />
                    </div>

                    <div className="flex items-center border border-gray-300 rounded-lg p-2 gap-2">
                        <AiOutlineGithub className="text-gray-500" />
                        <input
                            {...register("githubLink")}
                            placeholder="Github Link"
                            className="flex-1 border-0 focus:outline-none text-sm"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition"
                    >
                        Submit Task
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTask;
