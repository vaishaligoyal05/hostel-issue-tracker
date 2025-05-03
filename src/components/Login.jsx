import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from 'react-icons/fa';
import axios from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/auth/login", { username, password });
      console.log("Response from server:", res.data);

      const { token, user } = res.data;

      if (!user?.role) {
        setError("Invalid username or password.");
        return;
      }

      if (user.role.toLowerCase() !== "student") {
        setError("Admins are not allowed here. Please login from Admin Login page.");
        return;
      }

      //  Save token and FULL user info
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("username", user.username);
      localStorage.setItem("user", JSON.stringify(user));  //  SAVE FULL USER OBJECT HERE

      // Navigate to dashboard
      navigate("/student/dashboard");

    } catch (err) {
      console.error("❌ Error during login:", err);
      setError(err.response?.data?.message || "Invalid username or password");
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center font-[Segoe UI] relative">
      <div className="bg-white w-[90vw] h-[90vh] rounded-xl shadow-2xl p-12 relative z-0">
        <h2 className="text-center text-5xl font-bold text-gray-800 mb-14">Log in</h2>

        <div className="w-[45%] ml-16">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-8">
            <div>
              <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-3/4 bg-gray-100 text-gray-700 text-base rounded-2xl py-2.5 px-4 placeholder-gray-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-3/4 bg-gray-100 text-gray-700 text-base rounded-2xl py-2.5 px-4 placeholder-gray-500 focus:outline-none"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-10 rounded-full text-base w-3/4"
            >
              Log in
            </button>
          </form>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 top-[65%]">
          <Link to="/forgot-password" className="text-blue-500 text-base underline">
            Forgot your password?
          </Link>
        </div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
          <Link to="/admin" className="admin-login underline text-sm">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
