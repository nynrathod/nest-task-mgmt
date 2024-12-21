import React, { useEffect, useRef, useState } from "react";
import { User } from "../../../shared/types.tsx";

interface UserDropdownProps {
  isDropdownOpen: boolean;
  onSelectUser: (user: User) => void;
  users: User[];
  onToggleDropdown: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  isDropdownOpen,
  onSelectUser,
  users,
  onToggleDropdown,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleUserSelect = (user: User) => {
    console.log("asdasfsd", user);
    onSelectUser(user);
    onToggleDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onToggleDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onToggleDropdown]);

  return (
    <div className="relative">
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
                  {user.firstName} ({user.email})
                </li>
              ))
            ) : (
              <li className="p-3 text-gray-400">No users found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
