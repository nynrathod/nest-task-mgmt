import { useEffect, useState } from "react";
import {
  ArrowRightStartOnRectangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify";
import TaskCard from "../components/Task/TaskCard.tsx";
import TaskForm from "../components/Task/TaskForm.tsx";
import { Task } from "../../shared/types.tsx";
import useAuth from "../../shared/utilities/hooks/useAuth";
import useLogout from "../../shared/utilities/hooks/useLogout.tsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetUsers } from "../../shared/services/api/user.ts";
import {
  getAllTask,
  updateTaskStatus,
} from "../../shared/services/api/task.ts";
import useWebSocket from "../../shared/utilities/hooks/useWebsocket.ts";
import Loader from "../components/widget/Loader.tsx";

const Home = () => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const { user } = useAuth();
  const { logout } = useLogout();

  const {
    refetch: refetchTask,
    data: tasksResponse = [],
    isLoading: loadingTasks,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getAllTask,
    enabled: false,
  });

  const { mutate: mutateStatuUpdate } = useMutation({
    mutationFn: updateTaskStatus,
  });

  const { refetch, data: usersResponse } = useQuery({
    queryKey: ["users"],
    queryFn: GetUsers,
    enabled: false,
  });

  const addTask = (newTask: Task) => {
    const taskWithId: Task = {
      ...newTask,
    };
    setTasks([taskWithId, ...tasks]);
  };

  const toggleTaskStatus = (id: number, checked: boolean) => {
    mutateStatuUpdate({ id: id, status: checked });
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status: !task.status } : task,
    );
    setTasks(updatedTasks);
  };

  const delteTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id != id);
    setTasks(updatedTasks);
  };

  const updateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task,
    );
    setTasks(updatedTasks);
  };

  const updateStatus = (updatedTask: Task) => {
    const { tempId } = updatedTask;

    const index = tasks.findIndex((task) => task.tempId === tempId);
    if (index !== -1) {
      const taskWithoutTempId = { ...updatedTask };
      delete taskWithoutTempId.tempId;
      const updatedTasks = [
        ...tasks.slice(0, index),
        taskWithoutTempId,
        ...tasks.slice(index + 1),
      ];
      setTasks(updatedTasks);
    }
  };

  useEffect(() => {
    if (Array.isArray(tasksResponse) && tasksResponse.length) {
      setTasks(tasksResponse);
    }
  }, [tasksResponse]);

  useEffect(() => {
    refetch();
    refetchTask();
  }, []);

  const socket = useWebSocket(user && user.id);

  useEffect(() => {
    if (socket) {
      socket.on("taskReminder", (data: { message: string; title: string }) => {
        toast(
          <div>
            <div>{data.message}</div>
            <div>{data.title}</div>
          </div>,
        );
      });
    }
  }, [socket]);

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <ToastContainer />
      <header className="bg-gray-950/50 rounded-xl mb-5">
        <nav
          className="mx-auto space-x-2 flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="text-2xl p-1.5">
              Task management
            </a>
          </div>
          <span>Hi {user && user.firstName}</span>
          <div
            className="text-sm/6 cursor-pointer flex items-center space-x-2 font-semibold"
            onClick={logout}
          >
            <ArrowRightStartOnRectangleIcon className="size-4" />
          </div>
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
        {isAdding && (
          <TaskForm
            addTask={addTask}
            updateStatus={updateStatus}
            users={usersResponse || []}
          />
        )}

        <div className="max-h-[500px] overflow-auto mt-4 space-y-4">
          {loadingTasks ? (
            <Loader />
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                toggleStatus={(id, checked) => toggleTaskStatus(id, checked)}
                updateTask={updateTask}
                isEditing={editingTaskId}
                users={usersResponse || []}
                setIsEditing={setEditingTaskId}
                updateStatus={updateStatus}
                delteTask={delteTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
