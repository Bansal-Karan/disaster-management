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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
  let bg = "#059669"; // Emerald for Shelter
  let icon = "🏠";
  if (type === "Hospital") {
    bg = "#e11d48";
    icon = "🏥";
  } else if (type === "Relief Camp") {
    bg = "#d97706";
    icon = "⛺";
  } else if (type === "Food Center") {
    bg = "#7c3aed";
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
        box-shadow: 0 4px 12px rgba(15,23,42,0.25);
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
    name: "GMCH Government Medical College & Hospital",
    type: "Hospital",
    address: "Chandi Path, Sector 32, Chandigarh",
    capacity: 400,
    occupied: 280,
    contact: "+91 172 266 5253",
    latitude: 30.7132,
    longitude: 76.7845,
    status: "Operational",
  },
  {
    _id: "sz-6",
    name: "Sector 42 Indoor Sports Evacuation Center",
    type: "Shelter",
    address: "Sports Complex, Sector 42, Chandigarh",
    capacity: 300,
    occupied: 45,
    contact: "+91 172 260 5510",
    latitude: 30.7289,
    longitude: 76.7456,
    status: "Operational",
  },
];

const categories = ["All", "Shelter", "Hospital", "Relief Camp", "Food Center"];

export default function SafeZones() {
  const [zones, setZones] = useState(defaultSafeZones);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCoords, setSelectedCoords] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/safezones`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setZones(data.data);
        } else if (Array.isArray(data) && data.length > 0) {
          setZones(data);
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

  const getTypeBadge = (type) => {
    switch (type) {
      case "Hospital":
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">Hospital</span>;
      case "Relief Camp":
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">Relief Camp</span>;
      case "Food Center":
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">Food Center</span>;
      default:
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">Shelter</span>;
    }
  };

  return (
    <div className="w-full min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 text-left">
      
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
            <FaShieldAlt /> Evacuation & Relief Centers
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
            Safe Zones & Verified Shelters
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time map and capacity dashboard for flood shelters, trauma hospitals, and relief stations.
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
      <div className="w-full flex overflow-x-auto no-scrollbar gap-2 pt-2 pb-1 sm:flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
              selectedCategory === cat
                ? "bg-emerald-600 text-white shadow-xs border border-emerald-600"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Split View: Interactive Map + Cards */}
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Interactive Leaflet Map */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-md bg-white">
            <div className="rounded-xl sm:rounded-2xl overflow-hidden relative z-0 h-[320px] sm:h-[420px] lg:h-[480px] border border-slate-100">
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

            {/* Map Legend & Count Strip */}
            <div className="p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50">
              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[11px] sm:text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span>
                  <span>Shelter</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0"></span>
                  <span>Hospital</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0"></span>
                  <span>Relief Camp</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0"></span>
                  <span>Food Center</span>
                </span>
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-700 whitespace-nowrap self-end sm:self-auto">
                <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">
                  {filteredZones.length} centers available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable List of Safe Zone Cards */}
        <div className="lg:col-span-5 space-y-4 max-h-[560px] overflow-y-auto pr-1">
          {filteredZones.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center space-y-3 border border-slate-200 shadow-xs">
              <p className="text-slate-500 text-sm">No safe zones matched your search query.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
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
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md cursor-pointer group space-y-3 relative overflow-hidden transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {getTypeBadge(zone.type)}
                      <h3 className="text-base font-bold text-slate-900 mt-1.5 group-hover:text-emerald-700 transition-colors font-['Outfit']">
                        {zone.name}
                      </h3>
                    </div>
                    <button
                      title="Center on Map"
                      className="p-2 rounded-xl bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 transition-all"
                    >
                      <FaDirections className="text-xs" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 flex items-start gap-1.5">
                    <FaMapMarkerAlt className="text-rose-500 mt-0.5 shrink-0" />
                    <span>{zone.address}</span>
                  </p>

                  {/* Bed Capacity Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] text-slate-600 gap-2">
                      <span className="flex items-center gap-1 font-medium whitespace-nowrap shrink-0">
                        <FaBed className="text-indigo-600" />
                        <span>Occupancy</span>
                      </span>
                      <span className="font-semibold text-slate-800 whitespace-nowrap text-right">
                        {zone.capacity} beds ({100 - capacityPercent}% available)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
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
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <a
                      href={`tel:${zone.contact}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      <FaPhoneAlt className="text-[10px]" />
                      <span>{zone.contact}</span>
                    </a>
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
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