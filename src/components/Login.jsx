import React, { useState } from "react";
import { FaUser, FaLock, FaIdBadge, FaEye, FaEyeSlash, FaShieldAlt, FaSpinner } from "react-icons/fa";
import Logo from "../assets/logo.png";
import { useNavigate, NavLink } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister && form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const res = await fetch(`${API_URL}/api/user/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          toast.success(data.message || "Account registered successfully! Please log in.");
          setIsRegister(false);
        } else {
          toast.error(data.message || "Registration failed. Please check your credentials.");
        }
      } else {
        const res = await fetch(`${API_URL}/api/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          localStorage.setItem("token", data.token);
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
          if (data.user?.role === 'admin' || data.user?.role === 'volunteer') {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        } else {
          toast.error(data.message || "Invalid credentials.");
        }
      }
    } catch (error) {
      console.log("Auth error:", error);
      toast.error("Could not connect to authentication server. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">

      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl grid md:grid-cols-12 gap-8 items-center relative z-10">

        {/* Left Side: Brand & Mission Info (Hidden on small mobile) */}
        <div className="hidden md:flex md:col-span-5 flex-col items-start space-y-6 text-left">
          <NavLink to="/" className="inline-flex items-center gap-3">
            <img
              src={Logo}
              alt="AapdaMitra"
              className="w-16 h-16 object-contain rounded-2xl bg-indigo-50 p-2 border border-indigo-100 shadow-sm"
            />
            <div>
              <span className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
                AapdaMitra
              </span>
              <p className="text-xs text-indigo-600 font-semibold tracking-wider uppercase">
                Disaster Relief Network
              </p>
            </div>
          </NavLink>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900 font-['Outfit'] leading-tight">
              Rapid Humanitarian Response Network
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sign in to manage emergency alerts, report disaster hazards, and coordinate shelter logistics with responders in your area.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs text-slate-700 w-full">
            <div className="flex items-center gap-2 font-semibold text-emerald-700">
              <FaShieldAlt /> Verified & Encrypted
            </div>
            <p className="text-[11px] text-slate-500">
              Your contact data and credentials remain securely safeguarded per disaster relief protocols.
            </p>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="md:col-span-7">
          <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-lg space-y-6 text-left bg-white">

            {/* Tab Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center ${!isRegister
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center ${isRegister
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Create Account
              </button>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
                {isRegister ? "Join the AapdaMitra Network" : "Welcome Back"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isRegister
                  ? "Register as a citizen, volunteer, or relief coordinator."
                  : "Enter your username and password to continue."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name (Only when registering) */}
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FaIdBadge className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karan Bansal"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Username or Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Username or Email *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. bansal@gmail.com or Bansal"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="glass-input w-full pl-9 pr-10 py-2.5 rounded-xl text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 text-xs"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Only when registering) */}
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Role Selection (Only when registering) */}
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Account Role
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-white text-slate-900"
                  >
                    <option value="user">Citizen / User</option>
                    <option value="volunteer">Rescue Volunteer</option>
                    <option value="admin">Disaster Response Coordinator (Admin)</option>
                  </select>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    <span>{isRegister ? "Creating Account..." : "Signing In..."}</span>
                  </>
                ) : (
                  <span>{isRegister ? "Complete Registration" : "Sign In to Account"}</span>
                )}
              </button>

            </form>

            <div className="text-center pt-2">
              <NavLink
                to="/"
                className="text-xs text-slate-500 hover:text-indigo-600 font-medium transition-colors"
              >
                ← Back to Home
              </NavLink>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}