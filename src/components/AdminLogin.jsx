// src/pages/AdminLogin.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from 'react-icons/fa';
import axios from '../api/axios'; // Adjust if your axios instance is elsewhere
import { jwtDecode } from "jwt-decode";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/auth/login", { username, password });
      const { token } = res.data;

      // 🆕 Decode the token
      const decoded = jwtDecode(token);
      const role = decoded.role;

      if (role.toLowerCase() !== "admin") {
        setError("Only admins can log in from this page. Please use Student Login.");
        return;
      }

      // Save token and role
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);

      navigate("/admin-panel/issues");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans relative">
      {/* Top-left hostel name with icon */}
      <div className="absolute top-6 left-6 flex items-center space-x-2">
        <FaHome className="text-black text-xl" />
        <span className="text-black text-lg font-semibold">Mai Bhago Hostel</span>
      </div>

      <div className="bg-white shadow-xl w-[90vw] max-w-5xl rounded-2xl p-12">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-12 font-serif">Admin Login</h2>

        <div className="max-w-md mx-auto text-left">
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label htmlFor="username" className="block text-lg text-gray-700 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-10">
              <label htmlFor="password" className="block text-lg text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold text-lg hover:bg-blue-600 transition"
            >
              Log in
            </button>
          </form>

          <p className="text-center text-blue-500 underline mt-6 text-sm hover:text-blue-700 cursor-pointer">
            Forgot your password?
          </p>
        </div>
      </div>

      <Link to="/" className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-gray-600 underline text-sm hover:text-gray-800">
        Student Login
      </Link>
    </div>
  );
};

export default AdminLogin;
