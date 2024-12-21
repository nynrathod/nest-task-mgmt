import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { useMutation } from "@tanstack/react-query";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDateRangeIcon } from "@heroicons/react/24/outline";
import { Task, User } from "../../../shared/types.tsx";
import UserDropdown from "./UserDropdown.tsx";
import { createTask } from "../../../shared/services/api/task.ts";

interface TaskFormProps {
  addTask: (task: Task) => void;
  updateStatus: (task: Task) => void;
  users: any;
}

const TaskForm: React.FC<TaskFormProps> = ({
  addTask,
  updateStatus,
  users,
}) => {
  const [title, setTitle] = useState<string>("");
  const [assignee, setAssignee] = useState<string>("");
  const [assigneeEmail, setAssigneeEmail] = useState<string>("");
  const [assigneeId, setAssigneeId] = useState<number>();
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const datePickerRef = useRef<DatePicker | null>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handlePlaceholderClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  const handleUserSelect = (user: User): void => {
    setAssignee(user.firstName);
    setAssigneeEmail(user.email);
    setAssigneeId(user.id);
    setIsDropdownOpen(false);
  };

  const { mutate: mutateAddTask } = useMutation({
    mutationFn: createTask,
    onSuccess: (newTask: any) => {
      const assignedUser = users.find(
        (user: User) => user.id === newTask?.assignee?.id,
      );

      if (!assignedUser) return;

      const atask: Task = {
        ...newTask,
        assignee: {
          firstName: assignedUser.firstName,
          email: assignedUser.email,
          id: assignedUser.id,
        },
        reminder: newTask.reminder || "No due date",
        tempId: newTask.tempId,
      };

      updateStatus(atask);
    },
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (!title.trim()) return;

    const newTask: Task = {
      title,
      assignee: { firstName: assignee, email: assigneeEmail, id: assigneeId! },
      reminder: dueDate || "No due date",
      status: false,
      processing: true,
      tempId: Date.now(),
    };

    mutateAddTask(newTask);
    addTask(newTask);
    setTitle("");
    setAssignee("");
    setAssigneeEmail("");
    setDueDate(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") handleSubmit(e);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 flex justify-between space-x-3 rounded-lg shadow-lg items-center"
      onKeyDown={handleKeyDown}
    >
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent focus:outline-0 px-4 h-[53px] text-white rounded-md"
      />

      <div className="relative">
        <div
          className="w-[30px] cursor-pointer rounded-full flex justify-center items-center bg-black"
          onClick={toggleDropdown}
        >
          {assignee.charAt(0) || users[0].firstName.charAt(0)}
        </div>

        <UserDropdown
          isDropdownOpen={isDropdownOpen}
          onSelectUser={handleUserSelect}
          users={users}
          onToggleDropdown={toggleDropdown}
        />
      </div>

      <DatePicker
        ref={datePickerRef}
        selected={dueDate ? new Date(dueDate) : null}
        onChange={(date: Date | null) =>
          setDueDate(date ? date.toISOString() : null)
        }
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={1}
        dateFormat="MMMM d, yyyy h:mm aa"
        className="hidden"
        placeholderText=" "
      />

      <div
        className="flex items-center p-3 text-gray-400 cursor-pointer rounded-md"
        onClick={handlePlaceholderClick}
      >
        <span className="mr-2 text-xs">
          {dueDate ? (
            new Date(dueDate).toLocaleDateString("en-GB") +
            " " +
            new Date(dueDate).toLocaleString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          ) : (
            <div className="text-xs">Reminder</div>
          )}
        </span>
        <div className="min-w-8 max-w-8">
          <CalendarDateRangeIcon className="max-w-5 min-w-5" />
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
