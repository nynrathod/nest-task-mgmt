import { useEffect, useState } from "react";
import {
  ArrowRightStartOnRectangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
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
import { ScaleLoader } from "react-spinners";
import useWebSocket from "../../shared/utilities/hooks/useWebsocket.ts";
import { toast, ToastContainer } from "react-toastify";

const Home = () => {
  const [isAdding, setIsAdding] = useState<boolean>(false); // Type for isAdding state
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null); // Type for editingTaskId state

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

  const [tasks, setTasks] = useState<Task[]>([]); // Ensure tasks are typed as Task[]

  useEffect(() => {
    console.log("tasks", tasks);
  }, [tasks]);

  useEffect(() => {
    if (tasksResponse.length) {
      setTasks(tasksResponse);
    }
  }, [tasksResponse]);

  const addTask = (newTask: Task) => {
    console.log("Asdasf", newTask);

    // Ensure newTask is typed as Task
    const taskWithId: Task = {
      ...newTask,
      // id: Date.now(), // Add a unique ID based on the current timestamp
    };
    setTasks([taskWithId, ...tasks]);
  };

  const { mutate: mutateStatuUpdate } = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: (newTask: any) => {
      console.log("asdasdanewtask", newTask);

      // console.log("ASdafdsgdfdf", newTask);
      // const helloTask = {
      //   ...newTask,
      //   status: "yes",
      // };
      // console.log("newTaskwwupdate", newTask);
      // updateStatus(helloTask);
    },
  });

  const toggleTaskStatus = (id: number, checked: boolean) => {
    console.log("checked", checked, id);

    mutateStatuUpdate({ id: id, status: checked });

    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status: !task.status } : task,
    );
    console.log("updatedTasks", updatedTasks);
    setTasks(updatedTasks);
  };

  const delteTask = (id: number) => {
    console.log("ASdasd", id);
    console.log("ASdasdtasks", tasks);
    // Filter out the task with the given id
    const updatedTasks = tasks.filter((task) => task.id != id);
    console.log("updatedTasks", updatedTasks);
    setTasks(updatedTasks);
  };

  const updateTask = (updatedTask: Task) => {
    // Ensure updatedTask is typed as Task
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task,
    );
    console.log("updatedTasksnew", updatedTasks);
    setTasks(updatedTasks);
  };

  const updateStatus = (updatedTask: Task) => {
    console.log("Updating task:", updatedTask);

    const { tempId } = updatedTask; // Extract tempId from the updated task

    // Find the index of the task with the matching tempId
    const index = tasks.findIndex((task) => task.tempId === tempId);

    if (index !== -1) {
      const taskWithoutTempId = { ...updatedTask };
      delete taskWithoutTempId.tempId;
      // delete taskWithoutTempId.processing;
      const updatedTasks = [
        ...tasks.slice(0, index),
        taskWithoutTempId,
        ...tasks.slice(index + 1),
      ];

      setTasks(updatedTasks);

      console.log("Task updated successfully:", updatedTasks);
    } else {
      console.error("Task with tempId not found:", tempId);
    }
  };

  const { refetch, data: usersResponse } = useQuery({
    queryKey: ["users"],
    queryFn: GetUsers,
    enabled: false,
  });

  useEffect(() => {
    refetch();
    refetchTask();
  }, []);

  // console.log("helloyser", user);
  // const userId = 2;
  const socket = useWebSocket(user.id);

  useEffect(() => {
    if (socket) {
      socket.on("taskReminder", (data: { message: string; title: string }) => {
        console.log("mydddd", data);
        // Display the reminder notification to the user
        // alert(data.message); // You can replace this with a more sophisticated notification system
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
            <div className="min-h-[500px] flex justify-center items-center">
              <ScaleLoader color="#0e8bff" />
            </div>
          ) : (
            tasks.map((task, index) => (
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
