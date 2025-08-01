import React, { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.access_token);
      navigate("/projects");
      setSuccess("Login successful!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const backendMessage = err.response?.data?.detail || "Invalid credentials";
      setError(backendMessage);
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-700 text-white py-3 px-6 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/addnectar_logo.png" alt="Logo" className="h-8 w-auto" />
          <h1 className="text-xl font-semibold">Billflow</h1>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
          
          <div className="flex justify-center mb-6">
            <img
              src="/addnectar_big_logo.png"
              alt="Addnectar Big Logo"
              className="h-16 w-auto"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md transition duration-200 cursor-pointer"
            >
              Login
            </button>

            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-600 text-center">{success}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}
