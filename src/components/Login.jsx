import React, { useState } from "react";
import { FaUser, FaLock, FaIdBadge, FaEye, FaEyeSlash, FaShieldAlt, FaSpinner, FaHandsHelping, FaCheckCircle } from "react-icons/fa";
import Logo from "../assets/logo.png";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);
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
          body: JSON.stringify({
            name: form.name.trim(),
            username: form.username.trim(),
            password: form.password,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          toast.success(data.message || "Account registered successfully! Please sign in.");
          setIsRegister(false);
          setForm({ ...form, password: "", confirmPassword: "" });
        } else {
          toast.error(data.message || "Registration failed. Please check your credentials.");
        }
      } else {
        const res = await fetch(`${API_URL}/api/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username.trim(),
            password: form.password,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          localStorage.setItem("token", data.token);
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }

          const returnTo = location.state?.from?.pathname;
          if (returnTo && returnTo !== "/login") {
            toast.success(`Welcome back, ${data.user?.name || "User"}!`);
            navigate(returnTo);
          } else if (data.user?.role === "admin" || data.user?.role === "volunteer") {
            toast.success(`Welcome back, ${data.user?.name || "Responder"}!`);
            navigate("/dashboard");
          } else {
            toast.success(`Welcome, ${data.user?.name || "Citizen"}!`);
            navigate("/");
          }
        } else {
          toast.error(data.message || "Invalid credentials. Please verify your username and password.");
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
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12 bg-slate-50">
      
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl grid md:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: Brand & Mission Info */}
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
              Rapid Emergency & Relief Network
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sign in to manage emergency alerts, enroll as a field volunteer, or coordinate relief logistics in your community.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs text-slate-700 w-full">
            <div className="flex items-center gap-2 font-semibold text-emerald-700">
              <FaShieldAlt /> Verified & Encrypted
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Your account and contact information remain protected under strict disaster relief and privacy standards.
            </p>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="md:col-span-7">
          <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-left bg-white">
            
            {/* Tab Switcher: Sign In vs Create Account */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  !isRegister
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  isRegister
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Header Text */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
                {isRegister ? "Join AapdaMitra Network" : "Welcome Back"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isRegister
                  ? "Register as a Citizen. You can apply to join the volunteer rescue team from your account."
                  : "Sign in with your username or email to continue."}
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
                      placeholder="e.g. Ramesh Kumar"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:border-indigo-500"
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
                    placeholder={isRegister ? "e.g. ramesh@gmail.com or ramesh12" : "e.g. yourname@gmail.com or username"}
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:border-indigo-500"
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
                    className="glass-input w-full pl-9 pr-10 py-2.5 rounded-xl text-sm border border-slate-200 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
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
                      className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Citizen info notice when registering */}
              {isRegister && (
                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2">
                  <FaHandsHelping className="text-indigo-600 text-sm shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    All accounts start as <b>Citizen</b>. Once registered, you can apply to join the emergency volunteer team and get approved by Admin.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    <span>{isRegister ? "Registering..." : "Signing In..."}</span>
                  </>
                ) : (
                  <span>{isRegister ? "Create Citizen Account" : "Sign In to AapdaMitra"}</span>
                )}
              </button>

            </form>

            {/* Footer Notice */}
            <div className="pt-2 text-center border-t border-slate-100">
              <p className="text-[11px] text-slate-400">
                {isRegister
                  ? "Already have an account? Click Sign In above."
                  : "Need to join? Click Create Account above to register as a Citizen or Volunteer."}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}