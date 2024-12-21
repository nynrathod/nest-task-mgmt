import React, { useEffect, useRef, useState } from "react";
import { BellIcon, TrashIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { CheckIcon } from "@heroicons/react/16/solid";
import { Task, User } from "../../../shared/types";
import UserDropdown from "./UserDropdown";
import { useMutation } from "@tanstack/react-query";
import { deleteTask, updatetask } from "../../../shared/services/api/task.ts";

interface TaskCardProps {
  task: Task;
  toggleStatus: (id: number, checked: boolean) => void;
  updateTask: (task: Task) => void;
  isEditing: string | null;
  setIsEditing: (id: number | null) => void;
  users: any;
  updateStatus: (task: Task) => void;
  delteTask: (task: number) => void;
}

const TaskCard = ({
  task,
  toggleStatus,
  updateTask,
  isEditing,
  setIsEditing,
  users,
  updateStatus,
  delteTask,
}: TaskCardProps) => {
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  const [originalTask, setOriginalTask] = useState<Task>({ ...task });
  const [isDeleted, setIsDeleted] = useState(false);
  useEffect(() => {
    console.log("ASdasllll", task);
    setEditedTask({ ...task });
    setOriginalTask({ ...task });
  }, [task]);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleted(true); // Trigger the deletion animation
    setTimeout(() => {
      mutateDeleteTask(task.id); // After animation, delete the task
    }, 300); // Match the duration of the animation
  };
  const { mutate: mutateDeleteTask } = useMutation({
    mutationFn: deleteTask,
    onSuccess: (newTask: any) => {
      console.log("asdasdanewtask", newTask);

      delteTask(newTask.id);
      // console.log("ASdafdsgdfdf", newTask);
      // const helloTask = {
      //   ...newTask,
      //   status: "yes",
      // };
      // console.log("newTaskwwupdate", newTask);
      // updateStatus(helloTask);
    },
  });

  const { mutate: mutateUpdateTask } = useMutation({
    mutationFn: updatetask,
    onSuccess: (newTask: any) => {
      console.log("ASdafdsgdfdf", newTask);
      const helloTask = {
        ...newTask,
      };
      delete helloTask.processing;
      console.log("newTaskwwupdate", helloTask);
      updateTask(helloTask);
    },
  });

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("editedTask", editedTask);

    const updatedTask: Task = {
      ...editedTask,
      processing: true,

      reminder:
        editedTask.reminder && !isNaN(new Date(editedTask.reminder).getTime())
          ? new Date(editedTask.reminder).toISOString()
          : null,
    };
    mutateUpdateTask(updatedTask);
    updateTask(updatedTask);
    setIsEditing(null);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedTask({ ...originalTask });
    setIsEditing(null);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.id) setIsEditing(task?.id);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [assignee, setAssignee] = useState<string>(
    editedTask.assignee?.firstName || "",
  );

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // const users: User[] = [
  //   { name: "John Doe", email: "john@example.com" },
  //   { name: "Jane Smith", email: "jane@example.com" },
  //   { name: "Alice Johnson", email: "alice@example.com" },
  //   { name: "Bob Lee", email: "bob@example.com" },
  // ];

  const handleUserSelect = (user: User) => {
    setAssignee(user.firstName);
    setEditedTask((prev) => ({
      ...prev,
      assignee: { firstName: user.firstName, email: user.email, id: user.id },
    }));
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log("hellotask", task);
  }, [task]);

  return (
    <>
      {task.processing ? (
        <div className="relative rounded-lg group">
          <div
            className={`bg-gray-800 animate-pulse relative p-4 block shadow-lg justify-between items-center transition-all duration-300`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 rounded-full bg-gray-600 animate-pulse"></div>

              <div className="flex justify-between w-full">
                <div>
                  <div className="bg-gray-600 w-[300px] rounded-lg animate-pulse h-6" />
                  <div>
                    <div className=" mt-2">
                      <div className="h-4 w-28 rounded-lg bg-gray-600 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full animate-pulse bg-gray-600 " />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`relative rounded-lg group ${isDeleted ? "task-delete" : ""} transition-all duration-300`}
          onClick={(e) => {
            if (!task.status) {
              handleEditClick(e);
            } else {
              e.stopPropagation();
            }
          }}
        >
          <TrashIcon
            className="size-7 opacity-0 hover:cursor-pointer rounded-full bg-gray-950/30 p-2 group-hover:opacity-100 transition-all duration-75 absolute top-1 right-1 z-10"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(e);
            }}
          />
          <div
            className={`bg-gray-800 relative p-4 block shadow-lg justify-between items-center ${
              task.status ? "opacity-50" : ""
            } transition-all duration-300`}
          >
            <div className="flex items-center space-x-4">
              <div>
                <input
                  type="checkbox"
                  id={task.title}
                  checked={task.status ?? false}
                  onChange={(e) => toggleStatus(task.id, e.target.checked)}
                  className="hidden "
                  onClick={(e) => e.stopPropagation()}
                />
                <label
                  className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center cursor-pointer  transition-colors"
                  htmlFor={task.title}
                  onClick={(e) => e.stopPropagation()}
                >
                  {task.status ? <CheckIcon className="size-3" /> : ""}
                </label>
              </div>
              {isEditing === task.id ? (
                <div className="flex flex-col space-y-2 w-full">
                  <input
                    type="text"
                    value={editedTask.title}
                    onChange={(e) =>
                      setEditedTask((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-700 text-white p-2 rounded-md"
                  />
                  <DatePicker
                    selected={
                      editedTask.reminder &&
                      !isNaN(new Date(editedTask.reminder).getTime())
                        ? new Date(editedTask.reminder)
                        : null
                    }
                    onChange={(date: Date | null) =>
                      setEditedTask((prev) => ({
                        ...prev,
                        reminder: date ? date.toISOString() : null,
                      }))
                    }
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    dateFormat="dd/MM/yyyy h:mm aa"
                    className="w-full bg-gray-700 text-white p-2 rounded-md"
                  />

                  <div className="relative">
                    <input
                      type="text"
                      value={assignee}
                      onClick={toggleDropdown}
                      onChange={(e) => setAssignee(e.target.value)}
                      className="w-full bg-gray-700 text-white p-2 rounded-md"
                      placeholder="Assign to"
                    />

                    <UserDropdown
                      isDropdownOpen={isDropdownOpen}
                      onSelectUser={handleUserSelect}
                      users={users}
                      onToggleDropdown={toggleDropdown}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="bg-green-700 w-full text-white px-4 py-2 rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-red-700 w-full text-white px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between w-full">
                  <div>
                    <div className="text-xl font-medium line-clamp-1">
                      {task.title}
                    </div>
                    <div className="text-gray-400 text-sm">
                      <div className="flex items-center space-x-2 mt-2">
                        <BellIcon className="size-3" />
                        <span className="text-xs">
                          {task.reminder &&
                          !isNaN(new Date(task.reminder).getTime())
                            ? new Date(task.reminder).toLocaleDateString(
                                "en-GB",
                              ) +
                              " " +
                              new Date(task.reminder).toLocaleString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : "No due date"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                      {task.assignee?.firstName.charAt(0)}
                    </div>
                    <span>{task.assignee?.firstName}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
