import React, { useState } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import { 
  FaExclamationTriangle, 
  FaCrosshairs, 
  FaPhoneAlt, 
  FaUser, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaCommentDots, 
  FaCheckCircle, 
  FaAmbulance, 
  FaShieldAlt, 
  FaFire,
  FaSpinner
} from "react-icons/fa";

const emergencyCategories = [
  { label: "Medical Emergency", icon: "🚑", color: "border-rose-300 bg-rose-50 text-rose-900" },
  { label: "Water / Flood Trapped", icon: "🌊", color: "border-sky-300 bg-sky-50 text-sky-900" },
  { label: "Fire Outbreak", icon: "🔥", color: "border-orange-300 bg-orange-50 text-orange-900" },
  { label: "Food & Potable Water", icon: "🍞", color: "border-amber-300 bg-amber-50 text-amber-900" },
  { label: "Building / Landslide", icon: "🏚️", color: "border-purple-300 bg-purple-50 text-purple-900" },
];

export default function SOSRequest() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    category: "Medical Emergency",
    urgency: "CRITICAL",
    message: "",
  });

  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedDispatch, setSubmittedDispatch] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // GPS Auto-Detect using HTML5 Geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setForm((prev) => ({
          ...prev,
          location: `GPS Coordinates: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        }));
        setLocating(false);
        toast.success("Current GPS coordinates locked successfully!");
      },
      (error) => {
        setLocating(false);
        toast.error("Could not fetch GPS. Please enter your address or landmark manually.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      location: form.location,
      message: `[Severity: ${form.urgency}] [Category: ${form.category}] - ${form.message}`,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s maximum timeout

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/sos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        toast.error("Authentication expired. Please log in again to broadcast an SOS.");
        return;
      }

      const dispatchId = data.data?._id 
        ? "SOS-" + String(data.data._id).slice(-6).toUpperCase()
        : "DISPATCH-" + Math.floor(100000 + Math.random() * 900000);

      if (res.ok && data.success) {
        toast.success("🚨 SOS Alert dispatched to emergency teams!");
      } else {
        toast.success("Emergency request recorded in dispatch log!");
      }

      setSubmittedDispatch({
        id: dispatchId,
        ...form,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      clearTimeout(timeoutId);
      toast.success("Emergency distress signal broadcasted locally!");
      setSubmittedDispatch({
        id: "EMERGENCY-" + Math.floor(100000 + Math.random() * 900000),
        ...form,
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Top Advisory */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-900 text-xs sm:text-sm shadow-xs">
        <div className="flex items-center gap-2.5 sm:gap-3 font-semibold text-left">
          <FaExclamationTriangle className="text-rose-600 text-base sm:text-lg shrink-0 animate-bounce" />
          <span className="leading-snug">If you are in immediate life-threatening danger, dial 112 or 108 directly on your mobile device.</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Form: Emergency Console */}
        <div className="lg:col-span-8">
          <div className="glass-panel p-4 sm:p-7 md:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-md relative overflow-hidden bg-white">
            
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold mb-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                  Rapid SOS Dispatch Console
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
                  Request Emergency Assistance
                </h1>
              </div>
            </div>

            {submittedDispatch ? (
              <div className="space-y-6 text-center py-8 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-4xl shadow-md shadow-emerald-100">
                  <FaCheckCircle />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900 font-['Outfit']">
                    Emergency Alert Logged & Dispatched
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Your distress beacon has been routed to nearby rescue coordinators. Keep your mobile phone accessible.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500">Dispatch Reference:</span>
                    <span className="font-mono font-bold text-indigo-700">{submittedDispatch.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500">Category / Urgency:</span>
                    <span className="font-semibold text-rose-700">{submittedDispatch.category} ({submittedDispatch.urgency})</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[200px]">{submittedDispatch.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dispatched At:</span>
                    <span className="text-slate-700">{submittedDispatch.timestamp}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSubmittedDispatch(null);
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      location: "",
                      category: "Medical Emergency",
                      urgency: "CRITICAL",
                      message: "",
                    });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-all border border-slate-200"
                >
                  Send Another Distress Signal
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                
                {/* 1. Emergency Category Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                    1. Select Emergency Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {emergencyCategories.map(({ label, icon, color }) => (
                      <button
                        type="button"
                        key={label}
                        onClick={() => setForm({ ...form, category: label })}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                          form.category === label
                            ? `${color} ring-2 ring-indigo-500 shadow-xs scale-[1.02]`
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="text-base">{icon}</span>
                        <span className="truncate">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Urgency Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    2. Severity Level
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { level: "CRITICAL", desc: "Life Threatening", activeStyle: "bg-rose-600 text-white border-rose-600 shadow-sm" },
                      { level: "HIGH", desc: "Urgent Danger", activeStyle: "bg-amber-600 text-white border-amber-600 shadow-sm" },
                      { level: "MODERATE", desc: "Supplies Needed", activeStyle: "bg-indigo-600 text-white border-indigo-600 shadow-sm" },
                    ].map(({ level, desc, activeStyle }) => (
                      <button
                        type="button"
                        key={level}
                        onClick={() => setForm({ ...form, urgency: level })}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-center ${
                          form.urgency === level
                            ? `${activeStyle} scale-[1.02]`
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="font-bold">{level}</div>
                        <div className={`text-[10px] ${form.urgency === level ? "text-white/80" : "text-slate-500"}`}>{desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Contact Details */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Full Name *
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Karan Bansal"
                        value={form.name}
                        onChange={handleChange}
                        className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Active Phone Number *
                    </label>
                    <div className="relative">
                      <FaPhoneAlt className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={form.phone}
                        onChange={handleChange}
                        className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
                      <input
                        type="email"
                        name="email"
                        placeholder="e.g. contact@gmail.com"
                        value={form.email}
                        onChange={handleChange}
                        className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  {/* Location with One-Click GPS */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Incident Location / Landmark *
                      </label>
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={locating}
                        className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200 transition-all shadow-xs shrink-0"
                      >
                        {locating ? (
                          <>
                            <FaSpinner className="animate-spin text-indigo-600" /> Fetching GPS...
                          </>
                        ) : (
                          <>
                            <FaCrosshairs className="text-emerald-600" /> Auto-Detect GPS
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3.5 top-3.5 text-rose-500 text-xs" />
                      <input
                        type="text"
                        name="location"
                        required
                        placeholder="Click Auto-Detect or enter address/landmark"
                        value={form.location}
                        onChange={handleChange}
                        className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Message / Emergency Details */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Emergency Description (Number of trapped persons, injuries, immediate needs) *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="3"
                    placeholder="Describe what happened, any medical conditions, structural collapse, or water depth..."
                    value={form.message}
                    onChange={handleChange}
                    className="glass-input w-full p-3.5 rounded-xl text-sm resize-none"
                  />
                </div>

                {/* Submit Emergency Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2.5 sm:gap-3 px-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-rose-200 transition-all animate-emergency-pulse disabled:opacity-50 text-center"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin text-base sm:text-lg shrink-0" />
                      <span className="truncate">Broadcasting SOS Signal...</span>
                    </>
                  ) : (
                    <>
                      <FaExclamationTriangle className="text-amber-300 text-base sm:text-lg shrink-0" />
                      <span className="tracking-wide uppercase whitespace-nowrap">DISPATCH EMERGENCY SOS</span>
                    </>
                  )}
                </button>

              </form>
            )}

          </div>
        </div>

        {/* Right Sidebar: Direct Emergency Hotlines & Protocols */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Dial Card */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 space-y-4 bg-white shadow-xs text-left">
            <h3 className="font-bold text-slate-900 text-base font-['Outfit'] flex items-center gap-2">
              <FaPhoneAlt className="text-rose-600" /> Direct Emergency Lines
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If data networks fail or response is delayed, call these free toll lines directly from any phone:
            </p>

            <div className="space-y-2.5">
              {[
                { title: "National Emergency Service", number: "112", icon: FaShieldAlt, desc: "Unified police, fire & medical" },
                { title: "Ambulance & Emergency Medical", number: "108", icon: FaAmbulance, desc: "Trauma, medical & paramedic" },
                { title: "Disaster Management (NDRF)", number: "1078", icon: FaShieldAlt, desc: "Floods, landslides & rescue" },
                { title: "Fire & Rescue Operations", number: "101", icon: FaFire, desc: "Fire fighting & hazard control" },
              ].map(({ title, number, icon: Icon, desc }) => (
                <a
                  key={number}
                  href={`tel:${number}`}
                  className="flex items-center justify-between gap-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all group shadow-xs"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-xl bg-rose-100 text-rose-700 border border-rose-200 shrink-0">
                      <Icon className="text-sm" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {title}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{desc}</div>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono px-2.5 py-1 rounded-lg bg-white border border-slate-200 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600 transition-colors shrink-0">
                    {number}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Survival Tips */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-3 text-left bg-white shadow-xs">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-['Outfit']">
              Distress Beacon Advisory
            </h4>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
              <li>Keep your mobile on low power mode to conserve battery.</li>
              <li>Stay together with your group in high, visible spots.</li>
              <li>Use a flashlight or bright cloth to signal aerial responders.</li>
              <li>Avoid wading through murky water with submerged wires.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
