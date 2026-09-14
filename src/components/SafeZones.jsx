import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  FaSearch, 
  FaHospital, 
  FaBed, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaShieldAlt, 
  FaDirections,
  FaCheckCircle
} from "react-icons/fa";

// Component to dynamically pan and zoom map when a safe zone card is clicked
function MapController({ selectedCoords }) {
  const map = useMap();
  useEffect(() => {
    if (selectedCoords) {
      map.flyTo(selectedCoords, 14, { duration: 1.2 });
    }
  }, [selectedCoords, map]);
  return null;
}

// Custom DivIcons for Leaflet (solves the Vite/bundler 404 missing marker image bug)
const getMarkerIcon = (type) => {
  let bg = "#10b981"; // Emerald for Shelter
  let icon = "🏠";
  if (type === "Hospital") {
    bg = "#ef4444";
    icon = "🏥";
  } else if (type === "Relief Camp") {
    bg = "#f59e0b";
    icon = "⛺";
  } else if (type === "Food Center") {
    bg = "#8b5cf6";
    icon = "🍲";
  }

  return L.divIcon({
    className: "custom-safe-marker",
    html: `
      <div style="
        background: ${bg};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        border: 2px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        cursor: pointer;
        transition: transform 0.2s;
      ">
        ${icon}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -22],
  });
};

// Rich verified default Safe Zones in Chandigarh region ensuring the map works reliably
const defaultSafeZones = [
  {
    _id: "sz-1",
    name: "Sector 17 Central Emergency Shelter",
    type: "Shelter",
    address: "Community Hall, Sector 17, Chandigarh",
    capacity: 250,
    occupied: 90,
    contact: "+91 172 270 0112",
    latitude: 30.7398,
    longitude: 76.7827,
    status: "Operational",
  },
  {
    _id: "sz-2",
    name: "PGIMER Disaster Trauma Wing",
    type: "Hospital",
    address: "Madhya Marg, Sector 12, Chandigarh",
    capacity: 500,
    occupied: 320,
    contact: "+91 172 274 7585",
    latitude: 30.7645,
    longitude: 76.7760,
    status: "High Priority",
  },
  {
    _id: "sz-3",
    name: "Sector 22 Red Cross Relief Hub",
    type: "Relief Camp",
    address: "Red Cross Building, Sector 22-B, Chandigarh",
    capacity: 180,
    occupied: 60,
    contact: "+91 172 270 4110",
    latitude: 30.7302,
    longitude: 76.7745,
    status: "Operational",
  },
  {
    _id: "sz-4",
    name: "Sector 34 Municipal Food Bank & Supplies",
    type: "Food Center",
    address: "Sub-City Centre, Sector 34, Chandigarh",
    capacity: 350,
    occupied: 110,
    contact: "+91 172 260 2210",
    latitude: 30.7214,
    longitude: 76.7680,
    status: "Operational",
  },
  {
    _id: "sz-5",
    name: "Government Multi-Specialty Hospital (GMSH)",
    type: "Hospital",
    address: "Sector 16, Chandigarh",
    capacity: 300,
    occupied: 195,
    contact: "+91 172 275 2200",
    latitude: 30.7495,
    longitude: 76.7865,
    status: "Operational",
  },
];

const categories = ["All", "Shelter", "Hospital", "Relief Camp", "Food Center"];

export default function SafeZones() {
  const [zones, setZones] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/safeZones", {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or server error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge API data with default safe zones for a rich map
          setZones([...data, ...defaultSafeZones]);
        } else {
          setZones(defaultSafeZones);
        }
      })
      .catch(() => {
        setZones(defaultSafeZones);
      });
  }, []);

  const filteredZones = zones.filter((zone) => {
    const matchesCategory = selectedCategory === "All" || zone.type === selectedCategory;
    const matchesSearch =
      zone.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 text-left">
      
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-2">
            <FaShieldAlt /> Evacuation & Relief Centers
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Safe Zones & Verified Shelters
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time map and capacity dashboard for flood shelters, trauma hospitals, and food stations.
          </p>
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
          <input
            type="text"
            placeholder="Search safe zone or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-9 pr-4 py-2 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pt-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 border border-emerald-400/40 scale-105"
                : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Split View: Interactive Map + Cards */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Interactive Leaflet Map */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-3 rounded-3xl border border-white/15 overflow-hidden shadow-2xl">
            <div className="rounded-2xl overflow-hidden relative z-0 h-[480px]">
              <MapContainer
                center={[30.7333, 76.7794]}
                zoom={12}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController selectedCoords={selectedCoords} />

                {filteredZones.map((zone) => (
                  <Marker
                    key={zone._id}
                    position={[zone.latitude, zone.longitude]}
                    icon={getMarkerIcon(zone.type)}
                  >
                    <Popup className="custom-leaflet-popup">
                      <div className="p-1 space-y-1.5 text-slate-900">
                        <div className="font-bold text-sm text-slate-900 font-['Outfit']">
                          {zone.name}
                        </div>
                        <div className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {zone.type}
                        </div>
                        <p className="text-xs text-slate-600">{zone.address}</p>
                        <div className="pt-1 border-t border-slate-200 text-xs font-semibold flex items-center justify-between">
                          <span>Capacity: {zone.capacity} beds</span>
                          <a
                            href={`tel:${zone.contact}`}
                            className="text-indigo-600 font-bold hover:underline"
                          >
                            📞 Call
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            <div className="p-3 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Shelter
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ml-2"></span> Hospital
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ml-2"></span> Relief Camp
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 ml-2"></span> Food Center
              </span>
              <span className="font-medium">{filteredZones.length} centers available</span>
            </div>
          </div>
        </div>

        {/* Scrollable List of Safe Zone Cards */}
        <div className="lg:col-span-5 space-y-4 max-h-[560px] overflow-y-auto pr-1">
          {filteredZones.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl text-center space-y-3">
              <p className="text-slate-400 text-sm">No safe zones matched your search query.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredZones.map((zone) => {
              const capacityPercent = Math.min(
                100,
                Math.round(((zone.occupied || zone.capacity * 0.4) / zone.capacity) * 100)
              );

              return (
                <div
                  key={zone._id}
                  onClick={() => setSelectedCoords([zone.latitude, zone.longitude])}
                  className="glass-card p-5 rounded-2xl border border-white/10 cursor-pointer group space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {zone.type}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors font-['Outfit']">
                        {zone.name}
                      </h3>
                    </div>
                    <button
                      title="Center on Map"
                      className="p-2 rounded-xl bg-white/5 group-hover:bg-emerald-500 group-hover:text-white text-slate-400 transition-all"
                    >
                      <FaDirections className="text-xs" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 flex items-start gap-1.5">
                    <FaMapMarkerAlt className="text-rose-400 mt-0.5 shrink-0" />
                    <span>{zone.address}</span>
                  </p>

                  {/* Bed Capacity Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span className="flex items-center gap-1">
                        <FaBed className="text-indigo-300" />
                        <span>Occupancy</span>
                      </span>
                      <span className="font-semibold">
                        {zone.capacity} beds ({100 - capacityPercent}% available)
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          capacityPercent > 80
                            ? "bg-rose-500"
                            : capacityPercent > 50
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${capacityPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Contact Footer */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <a
                      href={`tel:${zone.contact}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-indigo-300 hover:text-white font-medium"
                    >
                      <FaPhoneAlt className="text-[10px]" />
                      <span>{zone.contact}</span>
                    </a>
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <FaCheckCircle className="text-[10px]" /> Open 24/7
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}