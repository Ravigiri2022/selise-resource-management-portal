import { useEffect, useState } from 'react';
import { AiOutlineClose, AiOutlinePlus, AiOutlinePlusCircle } from 'react-icons/ai'
import type { Project, Task } from '../types';
import { projectService } from '../services/services';
import StatusLabel from './StatusLabel';

const ProjectList = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [projectTasks, setProjectTasks] = useState<Task[]>([]);
    const [popUp, setPopUp] = useState(false);
    const [title, setTitle] = useState("");

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
    const handleClick = async (project: Project) => {
        try {
            const data = await projectService.getTasksByProjectId(project.id);
            console.log(data);
            setProjectTasks(data);
            setSelectedProject(project);
        } catch (err) {
            console.error(err);
        }
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const project = {
            project: {
                name: title,
            },
        };
        try {
            const res = await projectService.create(project);
            setProjects((prev) => [...prev, res]);
            setPopUp(!popUp);
        } catch (err) {
            console.log(err);
        }

    }
    return (
        <div className='p-3 space-y-3'>
            {selectedProject && (
                <div className='w-full h-full fixed flex items-center justify-center bg-black/50 inset-0'>
                    <div className='bg-white font-mono w-[40vh] h-[70vh] p-5 md:w-[80vh] rounded-lg'>
                        <div className='flex justify-between'>
                            <span className='font-semibold'>Project Details</span>
                            <span onClick={() => { setSelectedProject(null); }}><AiOutlineClose /></span>
                        </div>
                        <div className='w-full space-y-2'>
                            <p>Project Title: <span>{selectedProject?.name}</span></p>
                            <p>id: <span>{selectedProject?.id}</span></p>
                            {!projectTasks[0] && (
                                <div className='text-gray-500'>
                                    ~ No Task assigned to this project
                                </div>
                            )}
                            {projectTasks[0] && (
                                <div>
                                    Tasks assigned to this project:
                                </div>
                            )}
                            {projectTasks.map((task) => (
                                <div key={task.id} className=' border rounded-lg p-3'>
                                    <p className='line-clamp-1 text-xl'>Task Name: <span className=''>{task.title}</span></p>
                                    <p>Status: <StatusLabel status={task.status} /></p>
                                    <p className='line-clamp-2'>Description: {task.description} </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
            }
            {popUp && (
                <div className='fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-black/50'>
                    <form className='bg-white rounded-lg space-y-3 p-2' onSubmit={(e) => handleSubmit(e)}>
                        <div className='flex items-center justify-between'>
                            <p className='text-xl: '>New Project Title </p>
                            <span onClick={() => { setPopUp(!popUp); }}><AiOutlineClose /></span>

                        </div>
                        <input type="text"
                            placeholder="Project Title"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}

                            className='border border-gray-300 focus:ring-2 focus:ring-blue-400 font-medium text-lg p-3 rounded-lg w-full transition'
                        />
                        <button type='submit' className=' border-[0.5px] rounded-lg px-3 py-1'>Submit</button>
                    </form>
                </div>

            )
            }

            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-sans font-semibold'>Projects List</h1>
                <div onClick={() => { setPopUp(!popUp) }}>
                    <div className=' h-[60px] sm:hidden text-4xl gap-3 rounded-lg flex items-center cursor-pointer justify-center'>
                        <AiOutlinePlusCircle />
                    </div>
                    <div className='py-2 px-3 hidden sm:inline-flex text-xl rounded-lg gap-1 border cursor-pointer items-center justify-center'>
                        <AiOutlinePlus />
                        <p className='text-lg'>New Project</p>
                    </div>
                </div>

            </div>

            <div className='w-full grid grid-cols-2 md:grid-cols-4 p-3 rounded-lg gap-4'>

                {projects.map((project) => (
                    <div key={project.id} className='w-full h-[150px] pt-4 flex border overflow-hidden flex-col items-start justify-between gap-2 shadow-lg py-2 px-2 cursor-pointer rounded-lg '
                        onClick={() => handleClick(project)}>
                        <span className='text-3xl overflow-hidden line-clamp-2'>{project.name}</span>
                        <span className='font-mono text-sm'>ID: <span>{project.id}</span></span>

                    </div>
                ))}
            </div>
        </div >
    )
}

export default ProjectList