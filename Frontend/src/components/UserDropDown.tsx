// UserDropdown.tsx
import { Eye, UserCheck, UserX, Trash2, MoreHorizontal } from "lucide-react";

interface UserDropdownProps {
  userId: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
}

export function UserDropdown({ userId, isOpen, onToggle }: UserDropdownProps) {
  const handleToggle = () => {
    onToggle(userId);
  };

  return (
    <div className="relative dropdown-container">
      <button
        onClick={handleToggle}
        className="text-gray-400 hover:text-gray-600 p-1"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="py-1">
            <button key="view" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              <Eye className="h-4 w-4" />
              View Details
            </button>
            <button key="verify" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              <UserCheck className="h-4 w-4" />
              Verify User
            </button>
            <button key="suspend" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              <UserX className="h-4 w-4" />
              Suspend User
            </button>
            <button key="delete" className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
              <Trash2 className="h-4 w-4" />
              Delete User
            </button>
          </div>
        </div>
      )}
    </div>
  );
}