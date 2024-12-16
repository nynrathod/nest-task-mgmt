import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDateRangeIcon } from "@heroicons/react/24/outline";
import { Task, User } from "../../shared/types.tsx";

interface TaskFormProps {
  addTask: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ addTask }) => {
  const [title, setTitle] = useState<string>("");
  const [assignee, setAssignee] = useState<string>(""); // Store assignee's name
  const [assigneeEmail, setAssigneeEmail] = useState<string>(""); // Store assignee's email
  const [dueDate, setDueDate] = useState<string | null>(null); // Store in ISO string format
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref for the dropdown container
  const datePickerRef = useRef<DatePicker | null>(null); // Create a reference to the DatePicker

  const handlePlaceholderClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true); // Open the calendar when the placeholder is clicked
    }
  };

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

  const handleUserSelect = (user: User): void => {
    setAssignee(user.name);
    setAssigneeEmail(user.email); // Save the email when selecting a user
    setIsDropdownOpen(false); // Close dropdown on user select
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    const newTask: Task = {
      title,
      assignee: assignee ? { name: assignee, email: assigneeEmail } : undefined, // Add photo from users if assignee exists
      done: false,
      due: dueDate || "No due date", // Store ISO string
    };

    addTask(newTask);
    setTitle("");
    setAssignee("");
    setAssigneeEmail(""); // Reset the email as well
    setDueDate(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
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

      {/* Assignee Input with Searchable Dropdown */}
      <div className="relative">
        <div
          className="w-[30px] cursor-pointer rounded-full flex justify-center items-center bg-black"
          onClick={() => setIsDropdownOpen(true)}
        >
          {assignee.charAt(0) || "N"}
        </div>

        {isDropdownOpen && (
          <div
            ref={dropdownRef} // Attach the ref here
            className="absolute top-full z-10 left-[-270px] w-[300px] bg-gray-700 text-white rounded-md mt-2 shadow-lg"
          >
            <input
              type="text"
              placeholder="Assign to"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full focus:outline-0 p-2 bg-gray-600 text-white"
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

      <DatePicker
        ref={datePickerRef} // Set the ref to access DatePicker methods
        selected={dueDate ? new Date(dueDate) : null} // Convert to Date object if ISO string exists
        onChange={(date: Date | null) =>
          setDueDate(date ? date.toISOString() : null)
        } // Save in ISO format
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMMM d, yyyy h:mm aa"
        className="hidden" // Hide the default input
        placeholderText=" " // Empty placeholder to avoid showing default text
      />

      {/* Custom Placeholder / Button */}
      <div
        className="flex items-center p-3 text-gray-400 cursor-pointer rounded-md"
        onClick={handlePlaceholderClick} // Open calendar on click
      >
        {/* Display the selected date or a default text */}
        <span className="mr-2 text-xs">
          {dueDate ? (
            new Date(dueDate).toLocaleDateString("en-GB") +
            " " +
            new Date(dueDate).toLocaleString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true, // To enable AM/PM format
            }) // Convert to local time for display
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
