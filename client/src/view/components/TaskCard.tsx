import React, { useEffect, useRef, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Task, User } from "../../shared/types.tsx";
import { CheckIcon } from "@heroicons/react/16/solid";

// Define types for Task and other props

interface TaskCardProps {
  task: Task;
  toggleStatus: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateTask: (task: Task) => void;
  isEditing: string | null;
  setIsEditing: (id: string | null) => void;
}

const TaskCard = ({
  task,
  toggleStatus,
  updateTask,
  isEditing,
  setIsEditing,
}: TaskCardProps) => {
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  const [originalTask, setOriginalTask] = useState<Task>({ ...task });

  useEffect(() => {
    setEditedTask({ ...task });
    setOriginalTask({ ...task });
  }, [task]);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("editedTask", editedTask);
    // Convert due date to ISO string format
    const updatedTask: Task = {
      ...editedTask,
      due: editedTask.due ? new Date(editedTask.due).toISOString() : null,
    };
    updateTask(updatedTask);
    setIsEditing(null); // Close editing mode
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedTask({ ...originalTask }); // Restore the original task state
    setIsEditing(null); // Close editing mode without saving
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.id) setIsEditing(task?.id); // Enable editing for this task
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [assignee, setAssignee] = useState<string>(
    editedTask.assignee?.name || "",
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref for the dropdown container

  // Example list of users (could be fetched from an API)
  const users: User[] = [
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
    { name: "Alice Johnson", email: "alice@example.com" },
    { name: "Bob Lee", email: "bob@example.com" },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleUserSelect = (user: User) => {
    setAssignee(user.name);
    setEditedTask((prev) => ({
      ...prev,
      assignee: { name: user.name, email: user.email },
    }));
    setIsDropdownOpen(false); // Close dropdown on user select
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false); // Close dropdown when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative rounded-lg"
      onClick={(e) => {
        if (!task.done) {
          handleEditClick(e);
        } else {
          e.stopPropagation();
        }
      }}
    >
      <div
        className={`bg-gray-800 relative p-4 block shadow-lg justify-between items-center ${
          task.done ? "opacity-50" : ""
        } transition-all duration-300`}
      >
        <div className="flex items-center space-x-4">
          <div>
            <input
              type="checkbox"
              id={task.title}
              checked={task.done}
              onChange={toggleStatus}
              className="hidden "
              onClick={(e) => e.stopPropagation()}
            />
            <label
              className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center cursor-pointer  transition-colors"
              htmlFor={task.title}
              onClick={(e) => e.stopPropagation()}
            >
              {task.done ? <CheckIcon className="size-3" /> : ""}
            </label>
          </div>
          {isEditing === task.id ? (
            <div className="flex flex-col space-y-2 w-full">
              {/* Editable Title */}
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full bg-gray-700 text-white p-2 rounded-md"
              />
              {/* Editable Reminder (Using React DatePicker) */}
              <DatePicker
                selected={
                  editedTask.due && !isNaN(new Date(editedTask.due).getTime())
                    ? new Date(editedTask.due)
                    : null
                }
                onChange={(date: Date | null) =>
                  setEditedTask((prev) => ({
                    ...prev,
                    due: date ? date.toISOString() : null,
                  }))
                }
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy h:mm aa"
                className="w-full bg-gray-700 text-white p-2 rounded-md"
              />

              <div className="relative">
                {/* Editable Assignee */}
                <input
                  type="text"
                  value={assignee}
                  onClick={() => setIsDropdownOpen(true)}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded-md"
                  placeholder="Assign to"
                />

                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full z-10 left-0 w-[300px] bg-gray-700 text-white rounded-md mt-2 shadow-lg"
                  >
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 bg-gray-600 text-white rounded-md"
                    />
                    <ul className="max-h-40 overflow-y-auto">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <li
                            key={user.email}
                            onClick={() => handleUserSelect(user)}
                            className="p-3 hover:bg-gray-600 cursor-pointer"
                          >
                            {user.name} ({user.email})
                          </li>
                        ))
                      ) : (
                        <li className="p-3 text-gray-400">No users found</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Save and Cancel Buttons */}
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
                      {task.due && !isNaN(new Date(task.due).getTime())
                        ? new Date(task.due).toLocaleDateString("en-GB") +
                          " " +
                          new Date(task.due).toLocaleString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true, // To enable AM/PM format
                          })
                        : "No due date"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                  {task.assignee?.name.charAt(0)}
                </div>
                <span>{task.assignee?.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
