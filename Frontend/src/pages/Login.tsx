import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle, CheckCircle, X } from "lucide-react";
import { loginUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../Redux/auth/authSlice.ts";

interface LoginFormData {
  email: string;
  password: string;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  // Toast functions
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    addToast("error", "Please fix the errors below");
    return;
  }

  setLoading(true);

  try {
    const { email, password } = formData;

    const response = await loginUser({ email, password });

    if (response.success) {
      const { token, user } = response;

      //  Dispatch to Redux
      dispatch(
        loginSuccess({
          token,
          user,
          role: user.role,
        })
      );

      addToast("success", "Login successful! Welcome back.");

      //  Role-based navigation
      if (user.role === "admin") Navigate("/admindashboard");
      else if (user.role === "landOfficer") Navigate("/land-officer");
      else if (user.role === "citizen") Navigate("/citizendashboard");
      else Navigate("/unauthorized");
    } else {
      addToast("error", "Invalid email or password. Please try again.");
    }
  } catch (error: any) {
    const errorMessage =
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    "An unexpected error occurred. Please try again.";

  addToast("error", errorMessage);
  } finally {
    setLoading(false);
  }
};

  const handleForgotPassword = () => {
    if (!formData.email) {
      addToast('info', 'Please enter your email address first');
      return;
    }
    
    if (validateEmail(formData.email)) {
      addToast('error', 'Please enter a valid email address');
      return;
    }
    
    addToast('success', 'Password reset link sent to your email!');
  };

  // Toast Component
  const Toast = ({ toast }: { toast: ToastMessage }) => {
    const getToastStyles = () => {
      switch (toast.type) {
        case 'success':
          return 'bg-green-500 text-white';
        case 'error':
          return 'bg-red-500 text-white';
        case 'info':
          return 'bg-blue-500 text-white';
        default:
          return 'bg-gray-500 text-white';
      }
    };

    const getIcon = () => {
      switch (toast.type) {
        case 'success':
          return <CheckCircle className="w-5 h-5" />;
        case 'error':
          return <AlertCircle className="w-5 h-5" />;
        case 'info':
          return <AlertCircle className="w-5 h-5" />;
        default:
          return null;
      }
    };

    return (
      <div className={`flex items-center justify-between p-4 rounded-lg shadow-lg mb-2 ${getToastStyles()} animate-in slide-in-from-right duration-300`}>
        <div className="flex items-center">
          {getIcon()}
          <span className="ml-2 font-medium">{toast.message}</span>
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="ml-4 hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>

      {/* Login Form */}
      <div className="relative bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                }`}
              />
            </div>
            {errors.email && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                  errors.password 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.password}
              </div>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold hover:underline transition-colors duration-200"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold py-3 rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </div>
            )}
          </button>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a 
                href="/register" 
                className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition-colors duration-200"
              >
                Create Account
              </a>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;