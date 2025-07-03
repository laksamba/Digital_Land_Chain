import { ShieldOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
        <div className="flex justify-center mb-4">
          <ShieldOff className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
