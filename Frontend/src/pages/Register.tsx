import React, { useState } from "react";

const Register: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWalletConnect = () => {
    console.log("Wallet connected!");
    setWalletConnected(true);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registering user:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-8">Register</h2>

        <form onSubmit={handleRegister}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Wallet Connect Button */}
          <div className="text-center mb-4">
            <button
              type="button"
              onClick={handleWalletConnect}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-lg font-semibold py-2 rounded-xl shadow-md hover:from-indigo-600 hover:to-blue-600 transition duration-300"
            >
              {walletConnected ? "Wallet Connected " : "🔗 Connect Wallet"}
            </button>
          </div>

          {/* Register Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-purple-600 text-white text-lg font-bold py-2 rounded-xl shadow-md hover:bg-purple-700 transition duration-300"
            >
             Register Now
            </button>
          <p>Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

