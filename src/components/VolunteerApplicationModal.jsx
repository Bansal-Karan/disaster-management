import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  FaHandsHelping, 
  FaTimes, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationCircle, 
  FaSpinner, 
  FaShieldAlt,
  FaUserCheck,
  FaHeart
} from "react-icons/fa";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const skillOptions = [
  "First Aid & CPR",
  "Search & Rescue",
  "Swimming / Boat Operations",
  "Medical & Nursing",
  "Emergency Driving (4x4 / Trucks)",
  "Food & Water Supply Logistics",
  "Shelter Operations & Relief",
  "Radio / Tech Communications",
];

const availabilityOptions = [
  "On-Call (24x7 Emergencies)",
  "Daytime Hours (8 AM - 8 PM)",
  "Night Shift Standby",
  "Weekends Only",
];

export default function VolunteerApplicationModal({ isOpen, onClose, onStatusUpdated }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [appStatus, setAppStatus] = useState(null); // null, 'Pending', 'Approved', 'Rejected'
  const [applicationData, setApplicationData] = useState(null);
  const [isVolunteerRole, setIsVolunteerRole] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  const [form, setForm] = useState({
    phone: "",
    location: "",
    skills: ["First Aid & CPR"],
    availability: "On-Call (24x7 Emergencies)",
    experience: "",
  });

  const fetchStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/volunteer/my-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsVolunteerRole(data.isVolunteer);
        if (data.application) {
          setAppStatus(data.application.status);
          setApplicationData(data.application);
          if (data.application.status === "Rejected") {
            setShowForm(false);
          }
        } else {
          setAppStatus(null);
          setShowForm(true);
        }
      }
    } catch (err) {
      console.warn("Could not fetch volunteer application status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const handleToggleSkill = (skill) => {
    setForm((prev) => {
      const exists = prev.skills.includes(skill);
      if (exists) {
        return { ...prev, skills: prev.skills.filter((s) => s !== skill) };
      } else {
        return { ...prev, skills: [...prev.skills, skill] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone.trim() || !form.location.trim() || !form.experience.trim()) {
      toast.error("Please fill in your phone number, location, and experience.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to submit a volunteer application.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/volunteer/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Application submitted for Admin review!");
        setAppStatus("Pending");
        setApplicationData(data.data);
        setShowForm(false);
        if (onStatusUpdated) onStatusUpdated();
      } else {
        toast.error(data.message || "Could not submit application.");
      }
    } catch (err) {
      toast.error("Network error submitting application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-xl w-full my-auto max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 relative text-left overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="shrink-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg border border-indigo-100">
              <FaHandsHelping />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                Join AapdaMitra Volunteer Force
              </h3>
              <p className="text-[11px] text-slate-500">
                Support emergency response teams, claim rescue missions, and aid disaster victims.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <FaSpinner className="animate-spin text-2xl mx-auto text-indigo-600" />
              <p className="text-xs">Checking your volunteer enrollment status...</p>
            </div>
          ) : isVolunteerRole ? (
            /* 1. Already an approved volunteer */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-3xl mx-auto shadow-sm">
                <FaUserCheck />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900 font-['Outfit']">
                  You Are an Active Field Volunteer!
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your volunteer credentials have been verified by AapdaMitra Command. You have permission to access the <b>Responder Desk</b>, claim SOS calls, and update mission outcomes.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Close & Access Responder Desk
                </button>
              </div>
            </div>
          ) : appStatus === "Pending" && !showForm ? (
            /* 2. Application Pending Admin Approval */
            <div className="py-6 space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-3xl mx-auto shadow-sm animate-pulse">
                <FaClock />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  <span>Application Under Coordinator Review</span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 font-['Outfit']">
                  Your Volunteer Request is Submitted
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for stepping up to serve! System Administrators review all volunteer profiles to ensure field coordination and safety. Once approved, your account will immediately be granted Volunteer Mission access.
                </p>
              </div>

              {applicationData && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs max-w-md mx-auto">
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500">Applicant:</span>
                    <span className="font-semibold text-slate-800">{applicationData.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500">Contact / City:</span>
                    <span className="font-semibold text-slate-800">{applicationData.phone} • {applicationData.location}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500">Availability:</span>
                    <span className="font-semibold text-slate-800">{applicationData.availability}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-500 block mb-1">Declared Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {applicationData.skills?.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] text-slate-700 font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200"
              >
                Close Window
              </button>
            </div>
          ) : appStatus === "Rejected" && !showForm ? (
            /* 3. Application Previously Rejected */
            <div className="py-6 space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center text-3xl mx-auto shadow-sm">
                <FaExclamationCircle />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900 font-['Outfit']">
                  Application Needs Revision
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your previous volunteer application could not be approved at this time.
                  {applicationData?.adminNotes && (
                    <span className="block mt-2 font-medium text-rose-800 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                      Coordinator Note: {applicationData.adminNotes}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowForm(true)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Update Profile & Re-apply
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* 4. Volunteer Application Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
                <FaHeart className="text-rose-500 text-sm shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Volunteers are dispatched to assist with water rescue, medical triage, food distribution, and emergency transports. All applications are reviewed by Disaster Command before access is granted.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.name || "Citizen"}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 border border-slate-200 text-slate-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Active Phone Number *
                  </label>
                  <div className="relative">
                    <FaPhoneAlt className="absolute left-3 top-2.5 text-slate-400 text-xs" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 rounded-xl text-xs border border-slate-200 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Operational City / District *
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-2.5 text-slate-400 text-xs" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chandigarh / Mohali / Dehradun"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 rounded-xl text-xs border border-slate-200 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Availability *
                  </label>
                  <select
                    value={form.availability}
                    onChange={(e) => setForm({ ...form, availability: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:border-indigo-500 outline-none bg-white text-slate-800"
                  >
                    {availabilityOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Skills Multi-Select Pills */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Applicable Relief & Response Skills (Choose all that apply):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {skillOptions.map((skill) => {
                    const isSelected = form.skills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => handleToggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all border ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Experience / Motivation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Experience, Certifications, or Reason for Joining *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Share details on your background (e.g. Red Cross trained, medical student, swimmer, civil defence volunteer, willing to distribute supplies)..."
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  className="w-full p-3 rounded-xl text-xs border border-slate-200 focus:border-indigo-500 outline-none leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <span>Submit Volunteer Application</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
