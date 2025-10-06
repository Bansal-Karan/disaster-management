import React, { useState } from "react";
import { FaUser, FaLock, FaIdBadge } from "react-icons/fa";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function AuthPage() {

  const navigate = useNavigate()
  const [role, setRole] = useState("user");
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        const res = await fetch('http://localhost:5000/api/user/register', {
          body: JSON.stringify(form),
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST"
        })

        const data = await res.json()

        toast.success(data.message)

        setIsRegister(false)
      }
      else {
        const res = await fetch('http://localhost:5000/api/user/login', {
          body: JSON.stringify(form),
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST"
        })

        const data = await res.json()

        toast.success(data.message)
        localStorage.setItem("token", data.token)

        navigate("/")

      }
    } catch (error) {
      console.log("Error:", error);

    }

    finally {
      setForm({
        name: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "user",
      })
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r">
      <div className="grid grid-cols-2 items-center gap-20">
        {/* Logo Section */}
        <div>
          <img
            src={Logo}
            alt="Disaster Management"
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 p-8 rounded-2xl shadow-xl text-white w-96"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isRegister ? "Register Account" : "Login"}
          </h2>

          {/* Name (only show in register) */}
          {isRegister && (
            <div className="flex items-center bg-gray-800 px-3 py-2 rounded-lg mb-3">
              <FaIdBadge className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Your Name"
                className="bg-transparent outline-none flex-1"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          )}

          {/* Username */}
          <div className="flex items-center bg-gray-800 px-3 py-2 rounded-lg mb-3">
            <FaUser className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Your Username"
              className="bg-transparent outline-none flex-1"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-gray-800 px-3 py-2 rounded-lg mb-3">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none flex-1"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* Confirm Password (only in register) */}
          {isRegister && (
            <div className="flex items-center bg-gray-800 px-3 py-2 rounded-lg mb-3">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Confirm Password"
                className="bg-transparent outline-none flex-1"
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>
          )}

          {/* Role Selection */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-gray-800 px-3 py-2 rounded-lg mb-4 outline-none"
          >
            <option value="user">User</option>
            <option value="volunteer">Volunteer</option>
            <option value="admin">Admin</option>
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold transition"
            onClick={handleSubmit}
          >
            {isRegister ? "Register" : "Login"}
          </button>

          {/* Links */}
          <div className="flex justify-between mt-3 text-sm">
            {!isRegister && (
              <a href="#" className="hover:underline text-blue-400">
                Forgot Password?
              </a>
            )}

            <p>
              {isRegister ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="ml-2 underline text-green-400"
              >
                {isRegister ? "Login" : "Register"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}