import { useEffect, useState } from "react";
import {
  ArrowRightStartOnRectangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { Task } from "../../shared/types.tsx";

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // Ensure tasks are typed as Task[]
  const [isAdding, setIsAdding] = useState<boolean>(false); // Type for isAdding state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null); // Type for editingTaskId state

  useEffect(() => {
    console.log("tasks", tasks);
  }, [tasks]);

  const addTask = (newTask: Task) => {
    // Ensure newTask is typed as Task
    const taskWithId: Task = {
      ...newTask,
      id: Date.now(), // Add a unique ID based on the current timestamp
    };
    setTasks([taskWithId, ...tasks]);
  };

  const toggleTaskStatus = (index: number) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task,
    );
    setTasks(updatedTasks);
  };

  const updateTask = (updatedTask: Task) => {
    // Ensure updatedTask is typed as Task
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task,
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <header className="bg-gray-950/50 rounded-xl mb-5">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="text-2xl p-1.5">
              Task management
            </a>
          </div>

          <a
            href="#"
            className="text-sm/6 flex items-center space-x-2 font-semibold"
          >
            <span>Log out</span>
            <ArrowRightStartOnRectangleIcon className="size-4" />
          </a>
        </nav>
      </header>

      <div className="max-w-xl m-auto">
        <div className="ml-auto w-fit">
          <button
            className="bg-blue-600 py-2 px-4 rounded-md mb-4"
            onClick={() => setIsAdding(!isAdding)}
          >
            {isAdding ? (
              "Cancel"
            ) : (
              <div className="flex space-x-2 text-sm items-center">
                <PlusIcon className="size-4" />
                <span>Add task</span>
              </div>
            )}
          </button>
        </div>
        {isAdding && <TaskForm addTask={addTask} />}

        <div className="mt-4 space-y-4">
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              toggleStatus={() => toggleTaskStatus(index)}
              updateTask={updateTask}
              isEditing={editingTaskId}
              setIsEditing={setEditingTaskId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
