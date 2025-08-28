// UserDropdown.tsx
import { Eye, UserCheck, UserX, Trash2, MoreHorizontal } from "lucide-react";
import { getdeleteUser } from "../api/adminApi"; // Adjust the import path based on your project structure
import { useState } from "react";

interface UserDropdownProps {
  userId: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  onDelete?: (userId: string) => void; // Optional callback to notify parent of deletion
}

export function UserDropdown({ userId, isOpen, onToggle, onDelete }: UserDropdownProps) {
  const [isDeleting, setIsDeleting] = useState(false); // State to handle loading state
  const [error, setError] = useState<string | null>(null); // State to handle errors

  const handleToggle = () => {
    onToggle(userId);
  };

  const handleDelete = async () => {
    // Optional: Add confirmation prompt
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await getdeleteUser(userId);
      // Notify parent component of successful deletion
      if (onDelete) {
        onDelete(userId);
      }
      // Optional: Show success notification
      alert("User deleted successfully!");
    } catch (err: any) {
      const errorMessage = err.error || "Failed to delete user. Please try again.";
      setError(errorMessage);
      alert(errorMessage); // Show error to user
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative dropdown-container">
      <button
        onClick={handleToggle}
        className="text-gray-400 hover:text-gray-600 p-1"
        disabled={isDeleting}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="py-1">
            <button
              key="view"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>
            <button
              key="verify"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <UserCheck className="h-4 w-4" />
              Verify User
            </button>
            <button
              key="suspend"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <UserX className="h-4 w-4" />
              Suspend User
            </button>
            <button
              key="delete"
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete User"}
            </button>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute right-0 mt-2 w-48 bg-red-100 rounded-md shadow-lg z-10 border border-red-200 p-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

// Assuming getdeleteUser is in a separate file (e.g., api.ts)
// If it's in the same file, you can keep it as is
