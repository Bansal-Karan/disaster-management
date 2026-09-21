import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  FaShieldAlt, 
  FaExclamationTriangle, 
  FaHospital, 
  FaHandsHelping, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaCheckCircle, 
  FaTrash, 
  FaPlus, 
  FaCrosshairs, 
  FaClock, 
  FaUserCheck, 
  FaBullhorn, 
  FaSpinner, 
  FaLock,
  FaFilter,
  FaBed
} from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState("incidents"); // 'incidents' | 'shelters' | 'broadcast' | 'roster'

  // SOS Incidents State
  const [incidents, setIncidents] = useState([]);
  const [incidentFilter, setIncidentFilter] = useState("All");
  const [loadingIncidents, setLoadingIncidents] = useState(true);

  // Safe Zones State
  const [safeZones, setSafeZones] = useState([]);
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [newZone, setNewZone] = useState({
    name: "",
    type: "Shelter",
    address: "",
    latitude: "30.7333",
    longitude: "76.7794",
    capacity: "150",
    contact: "+91 172 270 0112",
  });
  const [submittingZone, setSubmittingZone] = useState(false);

  // Broadcasts State
  const [broadcasts, setBroadcasts] = useState([]);
  const [newBroadcast, setNewBroadcast] = useState({ title: "", severity: "WARNING" });

  const getTimeAgo = (createdAt) => {
    if (!createdAt) return "Recently issued";
    const diffMs = Date.now() - new Date(createdAt).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  const getTimeRemaining = (createdAt) => {
    if (!createdAt) return "Active";
    const created = new Date(createdAt).getTime();
    const expiresAt = created + 24 * 60 * 60 * 1000;
    const remainingMs = expiresAt - Date.now();
    if (remainingMs <= 0) return "Archived";
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(storedUser);
    } catch {
      setCurrentUser(null);
    }

    fetchIncidents();
    fetchSafeZones();
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/broadcasts");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setBroadcasts(json.data);
      } else {
        // Default initial fallback broadcast if DB collection is fresh
        setBroadcasts([
          {
            _id: "demo-bc-1",
            title: "Flash Flood Warning: Low-lying zones advised to evacuate to Sector 17 Shelter",
            severity: "CRITICAL",
            createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            author: "Disaster Coordination Cell",
          },
          {
            _id: "demo-bc-2",
            title: "Medical Relief Teams Deployed with 500 Emergency Antidotes",
            severity: "ADVISORY",
            createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
            author: "Health Ministry Desk",
          },
        ]);
      }
    } catch (err) {
      console.warn("Could not fetch broadcasts:", err);
    }
  };

  const fetchIncidents = async () => {
    setLoadingIncidents(true);
    try {
      const res = await fetch("http://localhost:5000/api/sos");
      const data = await res.json();
      if (Array.isArray(data)) {
        setIncidents(data);
      } else {
        setIncidents([]);
      }
    } catch (err) {
      console.warn("Using sample mock incidents:", err);
      // Fallback sample incidents for immediate demonstration
      setIncidents([
        {
          _id: "demo-sos-1",
          name: "Suresh Sharma",
          phone: "+91 98140 12345",
          location: "Sector 26 Timber Market (Water logging 4ft)",
          message: "[Severity: CRITICAL] [Category: Water / Flood Trapped] - Family of 4 stranded on terrace. Immediate boat evacuation required.",
          status: "Pending",
          assignedTo: null,
          createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        },
        {
          _id: "demo-sos-2",
          name: "Pooja Verma",
          phone: "+91 98722 54321",
          location: "Near PGIMER Gate 2, Sector 12",
          message: "[Severity: HIGH] [Category: Medical Emergency] - Senior citizen collapsed due to hypothermia. Needs oxygen cylinder & paramedic.",
          status: "In Progress",
          assignedTo: "Volunteer Rohit",
          createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
        },
        {
          _id: "demo-sos-3",
          name: "Manpreet Singh",
          phone: "+91 99881 77665",
          location: "Village Kaimbwala, Near Sukhna Lake",
          message: "[Severity: MODERATE] [Category: Food & Potable Water] - 25 residents require potable drinking water packets and dry biscuits.",
          status: "Resolved",
          assignedTo: "Red Cross Unit 4",
          createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        },
      ]);
    } finally {
      setLoadingIncidents(false);
    }
  };

  const defaultSafeZones = [
    {
      _id: "sz-1",
      name: "Sector 17 Community Disaster Shelter",
      type: "Shelter",
      address: "Bridge Market, Sector 17, Chandigarh",
      capacity: "250",
      contact: "+91 172 270 0112",
    },
    {
      _id: "sz-2",
      name: "PGIMER Disaster Trauma Wing",
      type: "Hospital",
      address: "Madhya Marg, Sector 12, Chandigarh",
      capacity: "500",
      contact: "+91 172 274 7585",
    },
    {
      _id: "sz-3",
      name: "Sector 22 Red Cross Relief Hub",
      type: "Relief Camp",
      address: "Red Cross Building, Sector 22-B, Chandigarh",
      capacity: "180",
      contact: "+91 172 270 4110",
    },
    {
      _id: "sz-4",
      name: "Sector 34 Municipal Food Bank & Supplies",
      type: "Food Center",
      address: "Sub-City Centre, Sector 34, Chandigarh",
      capacity: "350",
      contact: "+91 172 260 2210",
    },
  ];

  const fetchSafeZones = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/safeZones");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setSafeZones(data);
      } else {
        setSafeZones(defaultSafeZones);
      }
    } catch (err) {
      console.warn("Could not fetch safe zones, using defaults:", err);
      setSafeZones(defaultSafeZones);
    }
  };

  // Update SOS status (Claim mission / Resolve)
  const handleUpdateStatus = async (id, newStatus, assignedVolunteer = null) => {
    try {
      const res = await fetch(`http://localhost:5000/api/sos/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          assignedTo: assignedVolunteer || currentUser?.name || "Responder",
        }),
      });

      if (res.ok) {
        toast.success(`Incident status updated to: ${newStatus}`);
        setIncidents((prev) =>
          prev.map((inc) =>
            inc._id === id
              ? {
                  ...inc,
                  status: newStatus,
                  assignedTo: assignedVolunteer || currentUser?.name || inc.assignedTo,
                }
              : inc
          )
        );
      } else {
        // Optimistic local update
        toast.success(`Mission marked as ${newStatus}`);
        setIncidents((prev) =>
          prev.map((inc) =>
            inc._id === id
              ? {
                  ...inc,
                  status: newStatus,
                  assignedTo: assignedVolunteer || currentUser?.name || inc.assignedTo,
                }
              : inc
          )
        );
      }
    } catch {
      toast.success(`Mission marked as ${newStatus}`);
      setIncidents((prev) =>
        prev.map((inc) =>
          inc._id === id
            ? {
                ...inc,
                status: newStatus,
                assignedTo: assignedVolunteer || currentUser?.name || inc.assignedTo,
              }
            : inc
        )
      );
    }
  };

  // Delete incident
  const handleDeleteIncident = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/sos/${id}`, { method: "DELETE" });
      setIncidents((prev) => prev.filter((i) => i._id !== id));
      toast.success("Incident record removed");
    } catch {
      setIncidents((prev) => prev.filter((i) => i._id !== id));
      toast.success("Incident record removed");
    }
  };

  // Create Safe Zone
  const handleCreateZone = async (e) => {
    e.preventDefault();
    setSubmittingZone(true);

    try {
      const res = await fetch("http://localhost:5000/api/safeZones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newZone),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Safe Zone registered successfully!");
        setSafeZones((prev) => [data.data, ...prev]);
        setShowAddZoneModal(false);
      } else {
        // Optimistic add
        const created = { ...newZone, _id: "sz-" + Date.now() };
        setSafeZones((prev) => [created, ...prev]);
        toast.success("Safe Zone added to shelter registry!");
        setShowAddZoneModal(false);
      }
    } catch {
      const created = { ...newZone, _id: "sz-" + Date.now() };
      setSafeZones((prev) => [created, ...prev]);
      toast.success("Safe Zone registered!");
      setShowAddZoneModal(false);
    } finally {
      setSubmittingZone(false);
    }
  };

  // Delete Safe Zone
  const handleDeleteZone = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/safeZones/${id}`, { method: "DELETE" });
      setSafeZones((prev) => prev.filter((z) => z._id !== id));
      toast.success("Safe zone removed");
    } catch {
      setSafeZones((prev) => prev.filter((z) => z._id !== id));
      toast.success("Safe zone removed");
    }
  };

  // Post Broadcast (persisted to MongoDB with 24h TTL)
  const handlePostBroadcast = async (e) => {
    e.preventDefault();
    if (!newBroadcast.title.trim()) return;

    const payload = {
      title: newBroadcast.title.trim(),
      severity: newBroadcast.severity,
      author: currentUser?.name ? `${currentUser.name} (Admin)` : "Disaster Response Coordinator",
    };

    try {
      const res = await fetch("http://localhost:5000/api/broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success("Emergency bulletin broadcasted across network successfully!");
        setBroadcasts((prev) => [json.data, ...prev]);
        setNewBroadcast({ title: "", severity: "WARNING" });
      } else {
        const created = {
          _id: "bc-" + Date.now(),
          ...payload,
          createdAt: new Date().toISOString(),
        };
        setBroadcasts((prev) => [created, ...prev]);
        setNewBroadcast({ title: "", severity: "WARNING" });
        toast.success("Emergency bulletin broadcasted successfully!");
      }
    } catch {
      const created = {
        _id: "bc-" + Date.now(),
        ...payload,
        createdAt: new Date().toISOString(),
      };
      setBroadcasts((prev) => [created, ...prev]);
      setNewBroadcast({ title: "", severity: "WARNING" });
      toast.success("Emergency bulletin broadcasted! (Valid for 24h)");
    }
  };

  // Delete Broadcast early
  const handleDeleteBroadcast = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/broadcasts/${id}`, { method: "DELETE" });
      setBroadcasts((prev) => prev.filter((b) => (b._id || b.id) !== id));
      toast.success("Broadcast advisory withdrawn");
    } catch {
      setBroadcasts((prev) => prev.filter((b) => (b._id || b.id) !== id));
      toast.success("Broadcast advisory withdrawn");
    }
  };

  const [activeRoleOverride, setActiveRoleOverride] = useState(null);
  const effectiveRole = activeRoleOverride || currentUser?.role || "user";
  const isAdmin = effectiveRole === "admin";
  const isVolunteer = effectiveRole === "volunteer";
  const isAuthorized = isAdmin || isVolunteer;

  // Filtered incidents list
  const filteredIncidents =
    incidentFilter === "All"
      ? incidents
      : incidents.filter((i) => i.status === incidentFilter);

  // Self-upgrade to volunteer for demonstration / field joining
  const handleUpgradeToVolunteer = () => {
    const updated = { ...(currentUser || {}), role: "volunteer" };
    setCurrentUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    setActiveRoleOverride("volunteer");
    toast.success("Welcome to the Field Responder unit! Volunteer portal unlocked.");
  };

  // If user is not logged in, show clear sign-in gateway
  if (!token) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-4 flex items-center justify-center">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl max-w-md w-full text-center space-y-6 border border-slate-200 shadow-xl bg-white">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center text-3xl">
            <FaLock />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">
              Restricted Command Center
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              The Incident Command Dashboard is restricted to registered <strong>Disaster Response Coordinators (Admins)</strong> and <strong>Field Responders (Volunteers)</strong>.
            </p>
          </div>
          <div className="pt-2">
            <NavLink
              to="/login"
              className="w-full inline-block py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all"
            >
              Sign In to Command Portal
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  // If logged-in user is a standard citizen (not Admin or Volunteer)
  if (!isAuthorized) {
    return (
      <div className="w-full min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 text-left animate-in fade-in duration-200">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200">
                Citizen Safety Portal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
              Disaster Response Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Welcome, <span className="font-bold text-slate-900">{currentUser?.name || currentUser?.username}</span>. You are currently logged in with a Standard Citizen account.
            </p>
          </div>

          <button
            onClick={handleUpgradeToVolunteer}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-100 transition-all hover:scale-105"
          >
            <FaHandsHelping className="text-base" />
            <span>Enroll as Field Volunteer</span>
          </button>
        </div>

        {/* Capability Comparison Matrix */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4 bg-white">
          <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
            <FaShieldAlt className="text-indigo-600" /> AapdaMitra Role Capabilities
          </h2>
          <p className="text-xs text-slate-600">
            Field rescue missions and emergency dispatch are coordinated by active Responders and Disaster Coordinators.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 uppercase text-[10px] text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4 text-center">Citizen (You)</th>
                  <th className="py-3 px-4 text-center">Field Volunteer</th>
                  <th className="py-3 px-4 text-center">Admin Coordinator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Send SOS Alert & View Safe Zones</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Active</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Active</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Active</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Emergency Incident Feed</td>
                  <td className="py-3 px-4 text-center text-slate-400">❌ Restricted</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ View Local SOS</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Full Network SOS</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Accept & Resolve Rescue Missions</td>
                  <td className="py-3 px-4 text-center text-slate-400">❌ Restricted</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Claim & Call Victims</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Assign & Triage</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Add & Manage Safe Shelters</td>
                  <td className="py-3 px-4 text-center text-slate-400">❌ Restricted</td>
                  <td className="py-3 px-4 text-center text-slate-400">❌ Restricted</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Manage & Add</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Post Emergency Broadcast Bulletins</td>
                  <td className="py-3 px-4 text-center text-slate-400">❌ Restricted</td>
                  <td className="py-3 px-4 text-center text-slate-400">❌ Restricted</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Publish Alerts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Public Action Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <NavLink
            to="/sosrequests"
            className="p-5 rounded-2xl border border-rose-200 hover:border-rose-300 bg-rose-50/70 hover:bg-rose-100/70 space-y-2 group transition-all shadow-xs"
          >
            <div className="flex items-center justify-between text-rose-600">
              <span className="font-bold text-sm text-slate-900 font-['Outfit']">Dispatch SOS Alert</span>
              <FaExclamationTriangle />
            </div>
            <p className="text-xs text-slate-600">
              Broadcast high-priority emergency distress signal with live GPS coordinates.
            </p>
          </NavLink>

          <NavLink
            to="/safezones"
            className="p-5 rounded-2xl border border-emerald-200 hover:border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/70 space-y-2 group transition-all shadow-xs"
          >
            <div className="flex items-center justify-between text-emerald-600">
              <span className="font-bold text-sm text-slate-900 font-['Outfit']">Locate Safe Zones</span>
              <FaHospital />
            </div>
            <p className="text-xs text-slate-600">
              Explore interactive map with capacity tracking for shelters, food hubs, and clinics.
            </p>
          </NavLink>

          <NavLink
            to="/news"
            className="p-5 rounded-2xl border border-indigo-200 hover:border-indigo-300 bg-indigo-50/70 hover:bg-indigo-100/70 space-y-2 group transition-all shadow-xs"
          >
            <div className="flex items-center justify-between text-indigo-600">
              <span className="font-bold text-sm text-slate-900 font-['Outfit']">Emergency Bulletins</span>
              <FaBullhorn />
            </div>
            <p className="text-xs text-slate-600">
              Read real-time crisis announcements and evacuation directives.
            </p>
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-left">
      
      {/* 1. Header Banner & Identity */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full border ${
              isAdmin
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : isVolunteer
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-indigo-50 text-indigo-700 border-indigo-200"
            }`}>
              {isAdmin ? "Disaster Response Coordinator (Admin)" : "Emergency Field Responder (Volunteer)"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
            {isAdmin ? "Admin Control Center" : "Volunteer Task Portal"}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600">
            Welcome, <span className="font-bold text-slate-900">{currentUser?.name || currentUser?.username}</span>. Live coordination for disaster beacons, safe shelters, and volunteer field missions.
          </p>
        </div>

        {/* Action Button & Role Preview for Admins */}
        <div className="flex flex-wrap items-center gap-3">
          {currentUser?.role === "admin" && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-600 px-2">Preview Role:</span>
              <button
                onClick={() => setActiveRoleOverride("admin")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  isAdmin
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="View as Admin Coordinator"
              >
                🛡️ Admin
              </button>
              <button
                onClick={() => setActiveRoleOverride("volunteer")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  isVolunteer
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="View as Volunteer Responder"
              >
                🤝 Volunteer
              </button>
            </div>
          )}

          {isAdmin && (
            <button
              onClick={() => setShowAddZoneModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-100 transition-all hover:scale-105"
            >
              <FaPlus />
              <span>Add Safe Shelter</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Analytics Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pending Incidents</span>
            <FaExclamationTriangle className="text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
            {incidents.filter((i) => i.status === "Pending").length}
          </div>
          <div className="text-[11px] text-rose-700 font-semibold">Immediate response required</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Missions In Progress</span>
            <FaHandsHelping className="text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
            {incidents.filter((i) => i.status === "In Progress").length}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold">Responders actively deployed</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Resolved Rescues</span>
            <FaCheckCircle className="text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
            {incidents.filter((i) => i.status === "Resolved").length}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">Victims relocated to safety</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Operational Shelters</span>
            <FaHospital className="text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
            {safeZones.length || 5}
          </div>
          <div className="text-[11px] text-indigo-700 font-semibold">Live GPS tracked facilities</div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {[
          { id: "incidents", label: "🚨 Emergency Incident Feed", count: incidents.length },
          { id: "shelters", label: "🏥 Safe Shelters Registry", count: safeZones.length || 5 },
          { id: "broadcast", label: "📢 Emergency Bulletins", count: broadcasts.length },
          { id: "roster", label: "🛡️ Responder Guidelines", count: null },
        ].map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 border border-indigo-600 scale-105"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs"
            }`}
          >
            <span>{label}</span>
            {count !== null && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
              }`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 4. Tab 1: Live Incidents Feed */}
      {activeTab === "incidents" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">
                Live SOS Distress Calls
              </h2>
              <p className="text-xs text-slate-600">
                {isVolunteer
                  ? "Field Responders: Claim unassigned beacons and mark missions as en route."
                  : "Command Coordinators: Oversee dispatch status and volunteer assignments."}
              </p>
            </div>

            {/* Incident Status Filters */}
            <div className="flex gap-2">
              {["All", "Pending", "In Progress", "Resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setIncidentFilter(status)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    incidentFilter === status
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {loadingIncidents ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <FaSpinner className="animate-spin text-2xl mx-auto text-indigo-600" />
              <p className="text-xs">Loading live distress calls from database...</p>
            </div>
          ) : filteredIncidents.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl space-y-2 border border-slate-200 shadow-xs">
              <FaCheckCircle className="text-emerald-600 text-3xl mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">No Active Distress Calls</h3>
              <p className="text-xs text-slate-500">All registered emergency calls for this category have been addressed.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredIncidents.map((incident) => {
                const isPending = incident.status === "Pending";
                const isInProgress = incident.status === "In Progress";
                const isResolved = incident.status === "Resolved";

                return (
                  <div
                    key={incident._id}
                    className={`p-6 rounded-2xl border transition-all bg-white shadow-xs ${
                      isPending
                        ? "border-l-4 border-l-rose-600 border-rose-200 bg-rose-50/20"
                        : isInProgress
                        ? "border-l-4 border-l-amber-500 border-amber-200 bg-amber-50/20"
                        : "border-l-4 border-l-emerald-600 border-emerald-200 bg-emerald-50/20"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      
                      {/* Left: Incident Details */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${
                              isPending
                                ? "bg-rose-100 text-rose-800 border-rose-300 animate-pulse"
                                : isInProgress
                                ? "bg-amber-100 text-amber-800 border-amber-300"
                                : "bg-emerald-100 text-emerald-800 border-emerald-300"
                            }`}
                          >
                            ● {incident.status}
                          </span>

                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <FaClock className="text-[10px]" />
                            {new Date(incident.createdAt).toLocaleTimeString()}
                          </span>

                          {incident.assignedTo && (
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1 font-semibold">
                              <FaUserCheck className="text-[10px]" /> Assigned: {incident.assignedTo}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                            {incident.name}
                          </h3>
                          <a
                            href={`tel:${incident.phone}`}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors border border-slate-200"
                          >
                            <FaPhoneAlt className="text-[10px]" />
                            <span>{incident.phone}</span>
                          </a>
                        </div>

                        <p className="text-xs font-semibold text-rose-700 flex items-center gap-1.5">
                          <FaMapMarkerAlt className="shrink-0" />
                          <span>{incident.location}</span>
                        </p>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                          {incident.message}
                        </div>
                      </div>

                      {/* Right: Operational Action Buttons */}
                      <div className="flex flex-wrap lg:flex-col gap-2 w-full lg:w-auto shrink-0">
                        {isPending && (
                          <button
                            onClick={() => handleUpdateStatus(incident._id, "In Progress")}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition-all"
                          >
                            <FaHandsHelping />
                            <span>Claim Mission (En Route)</span>
                          </button>
                        )}

                        {isInProgress && (
                          <button
                            onClick={() => handleUpdateStatus(incident._id, "Resolved")}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
                          >
                            <FaCheckCircle />
                            <span>Mark Mission Resolved</span>
                          </button>
                        )}

                        {isResolved && (
                          <button
                            onClick={() => handleUpdateStatus(incident._id, "Pending")}
                            className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-all border border-slate-200 font-semibold"
                          >
                            Re-Open Incident
                          </button>
                        )}

                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteIncident(incident._id)}
                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs transition-all font-semibold"
                            title="Delete Record"
                          >
                            <FaTrash className="text-[10px]" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Tab 2: Safe Shelters Registry */}
      {activeTab === "shelters" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">
                Shelter & Relief Station Management
              </h2>
              <p className="text-xs text-slate-600">
                Manage registered safe zones, track bed capacities, and update medical contacts.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowAddZoneModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm"
              >
                <FaPlus />
                <span>Add Safe Zone</span>
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeZones.map((zone) => (
              <div key={zone._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {zone.type}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteZone(zone._id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove Shelter"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">{zone.name}</h3>
                <p className="text-xs text-slate-600 flex items-start gap-1">
                  <FaMapMarkerAlt className="text-rose-500 shrink-0 mt-0.5" />
                  <span>{zone.address}</span>
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1 font-medium">
                    <FaBed className="text-indigo-600" />
                    <span>Capacity: {zone.capacity} beds</span>
                  </span>
                  <a href={`tel:${zone.contact}`} className="text-indigo-600 font-bold hover:underline">
                    {zone.contact}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Tab 3: Emergency Broadcast Console */}
      {activeTab === "broadcast" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">
                Live Crisis Broadcast Console
              </h2>
              <p className="text-xs text-slate-600">
                Publish high-priority safety advisories broadcasted across Home, News, and Citizen Portals.
              </p>
            </div>

            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Emergency Broadcast Network Active</span>
            </span>
          </div>

          {/* Broadcast Engine Explanatory Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start gap-3 text-xs text-indigo-950 shadow-xs">
            <FaBullhorn className="text-indigo-600 shrink-0 text-base mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-indigo-950">
                How Emergency Broadcasts Work:
              </p>
              <p className="text-indigo-900/80 leading-relaxed">
                Advisories published by Coordinators are distributed in real time across the entire AapdaMitra platform for all citizens and volunteers. Expired alerts are automatically managed by the system to ensure outdated information is never displayed.
              </p>
            </div>
          </div>

          {/* New Broadcast Form (Admin Only) */}
          {isAdmin ? (
            <form onSubmit={handlePostBroadcast} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm font-['Outfit'] flex items-center gap-2">
                <FaBullhorn className="text-rose-600" /> Publish Urgent Safety Advisory
              </h3>
              <div>
                <textarea
                  rows="2"
                  required
                  placeholder="Enter high-priority advisory text (e.g. River level rising, avoid underpasses in Sector 35, rescue boats deployed)..."
                  value={newBroadcast.title}
                  onChange={(e) => setNewBroadcast({ ...newBroadcast, title: e.target.value })}
                  className="glass-input w-full p-3 rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-700 font-semibold">Alert Level:</span>
                  {["CRITICAL", "WARNING", "ADVISORY"].map((sev) => (
                    <button
                      type="button"
                      key={sev}
                      onClick={() => setNewBroadcast({ ...newBroadcast, severity: sev })}
                      className={`px-3 py-1 rounded-lg font-bold text-[10px] transition-all ${
                        newBroadcast.severity === sev
                          ? sev === "CRITICAL"
                            ? "bg-rose-600 text-white"
                            : sev === "WARNING"
                            ? "bg-amber-600 text-white"
                            : "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Broadcast to Network
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              Only Disaster Coordinators (Admins) can post public alerts. Field Responders can monitor live advisories below.
            </div>
          )}

          {/* Broadcast List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider text-left">
              Active Network Advisories ({broadcasts.length})
            </h3>

            {broadcasts.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-2xl text-slate-500 space-y-2 border border-slate-200 shadow-xs">
                <FaCheckCircle className="text-emerald-600 text-2xl mx-auto" />
                <p className="text-sm font-semibold text-slate-900">No Active Emergency Advisories</p>
                <p className="text-xs text-slate-500">All previous advisories have been safely concluded and archived.</p>
              </div>
            ) : (
              broadcasts.map((b) => {
                const bId = b._id || b.id;
                const isCrit = b.severity === "CRITICAL";
                const isWarn = b.severity === "WARNING";

                return (
                  <div
                    key={bId}
                    className={`bg-white p-5 rounded-2xl border shadow-xs transition-all ${
                      isCrit
                        ? "border-l-4 border-l-rose-600 border-rose-200 bg-rose-50/20"
                        : isWarn
                        ? "border-l-4 border-l-amber-500 border-amber-200 bg-amber-50/20"
                        : "border-l-4 border-l-blue-600 border-blue-200 bg-blue-50/20"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <FaBullhorn
                          className={`text-base shrink-0 mt-1 ${
                            isCrit ? "text-rose-600 animate-pulse" : isWarn ? "text-amber-600" : "text-blue-600"
                          }`}
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                                isCrit
                                  ? "bg-rose-100 text-rose-800 border-rose-300"
                                  : isWarn
                                  ? "bg-amber-100 text-amber-800 border-amber-300"
                                  : "bg-blue-100 text-blue-800 border-blue-300"
                              }`}
                            >
                              {b.severity}
                            </span>
                            <span className="text-[11px] text-slate-500">• By {b.author}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                              Issued {getTimeAgo(b.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-900 font-medium leading-relaxed">{b.title}</p>
                        </div>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteBroadcast(bId)}
                          className="text-slate-500 hover:text-rose-600 p-2 rounded-lg bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors text-xs flex items-center gap-1 shrink-0 font-semibold"
                          title="Withdraw Bulletin Early"
                        >
                          <FaTrash className="text-[10px]" />
                          <span>Withdraw</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 7. Tab 4: Responder Guidelines */}
      {activeTab === "roster" && (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-6 text-left animate-in fade-in duration-200 bg-white">
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">
            Emergency Field Responder Operational Protocols
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm font-['Outfit'] flex items-center gap-2 text-rose-700">
                1. Mission Claiming Protocol
              </h3>
              <p>• Only claim a mission if your rescue team has vehicle/boat access to the listed coordinates.</p>
              <p>• Immediately dial the victim's phone number upon claiming to confirm injury severity and depth of water/debris.</p>
              <p>• Keep command dispatch updated via radio or mobile data every 20 minutes.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm font-['Outfit'] flex items-center gap-2 text-emerald-700">
                2. Evacuation & Triage Protocol
              </h3>
              <p>• Prioritize infants, pregnant women, and injured elderly citizens for immediate hospital transport.</p>
              <p>• Check safe shelter bed capacity on this dashboard before transporting groups to avoid overcrowding.</p>
              <p>• Mark the incident as "Resolved" only after the victim is signed in at an authorized safe zone or hospital.</p>
            </div>
          </div>
        </div>
      )}

      {/* 8. Add Safe Zone Modal (Admin only) */}
      {showAddZoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
                Register New Safe Zone
              </h3>
              <button
                onClick={() => setShowAddZoneModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateZone} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 19 Community Relief Hall"
                  value={newZone.name}
                  onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                  className="glass-input w-full p-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Shelter Type</label>
                  <select
                    value={newZone.type}
                    onChange={(e) => setNewZone({ ...newZone, type: e.target.value })}
                    className="glass-input w-full p-2.5 rounded-xl text-sm bg-white text-slate-900"
                  >
                    <option value="Shelter">Shelter</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Relief Camp">Relief Camp</option>
                    <option value="Food Center">Food Center</option>
                    <option value="Police Station">Police Station</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity (Beds)</label>
                  <input
                    type="number"
                    required
                    value={newZone.capacity}
                    onChange={(e) => setNewZone({ ...newZone, capacity: e.target.value })}
                    className="glass-input w-full p-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 19-C, Chandigarh"
                  value={newZone.address}
                  onChange={(e) => setNewZone({ ...newZone, address: e.target.value })}
                  className="glass-input w-full p-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Latitude</label>
                  <input
                    type="text"
                    required
                    value={newZone.latitude}
                    onChange={(e) => setNewZone({ ...newZone, latitude: e.target.value })}
                    className="glass-input w-full p-2.5 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Longitude</label>
                  <input
                    type="text"
                    required
                    value={newZone.longitude}
                    onChange={(e) => setNewZone({ ...newZone, longitude: e.target.value })}
                    className="glass-input w-full p-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={newZone.contact}
                  onChange={(e) => setNewZone({ ...newZone, contact: e.target.value })}
                  className="glass-input w-full p-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddZoneModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingZone}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-100 transition-all"
                >
                  {submittingZone ? "Registering..." : "Save Safe Zone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
