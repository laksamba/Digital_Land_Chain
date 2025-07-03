import { useDispatch } from "react-redux";
import { logout } from "../Redux/auth/authSlice.ts"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
   <button
  onClick={handleLogout}
  className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
>
  <LogOut className="h-5 w-5" />
  <span className="text-base font-semibold tracking-wide">Logout</span>
</button>

  );
};

export default LogoutButton;
