import React, { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/logo.png';
import NewsSection from './NewsSection';
import { 
  FaExclamationTriangle, 
  FaBullhorn,
  FaMapMarkedAlt, 
  FaPhoneAlt, 
  FaShieldAlt, 
  FaHandsHelping, 
  FaHospital, 
  FaArrowRight,
  FaCheckCircle,
  FaWater,
  FaFire,
  FaWind
} from 'react-icons/fa';

const stats = [
  { value: '45+', label: 'Verified Safe Zones', detail: 'Real-time shelter capacity' },
  { value: '< 6 Min', label: 'Average Response Time', detail: 'Rapid rescue coordination' },
  { value: '1,450+', label: 'Volunteers on Standby', detail: 'Certified medical & NDRF responders' },
  { value: '24 / 7', label: 'Active Command Center', detail: 'Direct link to state relief desks' },
];

const preparednessGuides = {
  floods: {
    title: 'Flood Protocol',
    icon: FaWater,
    color: 'text-sky-600',
    steps: [
      'Move immediately to higher ground; avoid walking or driving through moving floodwater.',
      'Disconnect electrical appliances to eliminate risks of electrocution.',
      'Drink only boiled or bottled water to avoid waterborne contaminants.',
      'Listen to official IMD and SMS warnings; do not return until authorities clear the area.',
    ],
  },
  earthquake: {
    title: 'Earthquake Protocol',
    icon: FaShieldAlt,
    color: 'text-amber-600',
    steps: [
      'DROP to the floor, COVER under a sturdy desk or table, and HOLD ON.',
      'Stay away from glass windows, heavy lighting, and tall furniture.',
      'If outdoors, move into an open area away from buildings, streetlights, and wires.',
      'After shocks cease, check for gas leaks and evacuate using stairways—not elevators.',
    ],
  },
  cyclone: {
    title: 'Cyclone Protocol',
    icon: FaWind,
    color: 'text-indigo-600',
    steps: [
      'Secure windows and doors; shutter or tape large glass panes.',
      'Store adequate clean water, dry provisions, emergency battery packs, and first aid.',
      'Remain indoors in the strongest interior room until the storm eye fully passes.',
      'Keep your radio tuned to Indian Meteorological Department (IMD) updates.',
    ],
  },
  fire: {
    title: 'Fire Outbreak Protocol',
    icon: FaFire,
    color: 'text-rose-600',
    steps: [
      'Crawl low under smoke where air is cooler and cleaner.',
      'Feel doorknobs with the back of your hand before opening; if warm, seek another route.',
      'Use stairwells immediately; never use elevators during a structural fire.',
      'Call emergency dispatch (101 / 112) as soon as you reach an outdoor assembly point.',
    ],
  },
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Home = () => {
  const [activeGuide, setActiveGuide] = useState('floods');
  const [broadcasts, setBroadcasts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/broadcasts`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setBroadcasts(json.data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch broadcasts for home page:', err);
      });
  }, []);

  const getTimeAgo = (createdAt) => {
    if (!createdAt) return 'Recently issued';
    const diffMs = Date.now() - new Date(createdAt).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  return (
    <div className="flex flex-col w-full pt-20 text-left">
      
      {/* Live Public Safety Emergency Directive Banner */}
      {broadcasts.length > 0 && (
        <div className="w-full bg-rose-50 border-b border-rose-200 px-4 py-3 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <span className="flex h-3 w-3 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-rose-600 text-white tracking-wider">
                  {broadcasts[0].severity} DIRECTIVE
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {broadcasts[0].title}
                </span>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  • Issued {getTimeAgo(broadcasts[0].createdAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
              <NavLink
                to="/news"
                className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>View Directives ({broadcasts.length})</span>
                <FaArrowRight className="text-[10px]" />
              </NavLink>
              <NavLink
                to="/safezones"
                className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs transition-all"
              >
                Find Shelters
              </NavLink>
            </div>
          </div>
        </div>
      )}

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Serene ambient backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold tracking-wide">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              24/7 National Crisis & Emergency Dispatch Network
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight font-['Outfit']">
              Rapid Response When <br />
              <span className="bg-gradient-to-r from-rose-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
                Every Second Counts
              </span>
            </h1>

            {/* Animated Typewriter Subheading */}
            <div className="h-10 flex items-center">
              <TypeAnimation
                sequence={[
                  'Your direct lifeline in critical natural disasters.', 3000,
                  'Real-time GPS routing to nearest verified shelters.', 3000,
                  'One-touch SOS dispatch to NDRF and local rescue teams.', 3000,
                  'Live disaster bulletins and verified crisis alerts.', 3000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-lg sm:text-xl font-semibold text-slate-700"
              />
            </div>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              Connect immediately with nearby relief shelters, send verified GPS-tagged emergency requests to responders, and receive real-time crisis bulletins.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <NavLink
                to="/sosrequests"
                className="flex items-center justify-center gap-2.5 sm:gap-3 px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-200 hover:scale-[1.02] transition-all animate-emergency-pulse text-center"
              >
                <FaExclamationTriangle className="text-amber-200 shrink-0" />
                <span>Send Emergency SOS</span>
              </NavLink>

              <NavLink
                to="/safezones"
                className="flex items-center justify-center gap-2 sm:gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm sm:text-base shadow-xs hover:scale-[1.02] transition-all text-center"
              >
                <FaMapMarkedAlt className="text-emerald-600 shrink-0" />
                <span>Find Safe Shelters</span>
              </NavLink>
            </div>

            {/* Quick Helpline Strip */}
            <div className="pt-3 sm:pt-4 space-y-2 text-left">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Emergency Helplines (Toll-Free):
              </span>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                <a
                  href="tel:112"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold shadow-xs whitespace-nowrap transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                  <span>112</span>
                  <span className="text-[11px] font-normal text-rose-600/80">(National)</span>
                </a>
                <a
                  href="tel:108"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold shadow-xs whitespace-nowrap transition-colors"
                >
                  <span>108</span>
                  <span className="text-[11px] font-normal text-rose-600/80">(Ambulance)</span>
                </a>
                <a
                  href="tel:1078"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold shadow-xs whitespace-nowrap transition-colors"
                >
                  <span>1078</span>
                  <span className="text-[11px] font-normal text-rose-600/80">(Disaster)</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Interactive Card Display */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative w-full max-w-md">
              <div className="glass-panel p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl relative z-10 border border-slate-200 shadow-md space-y-4 sm:space-y-6 bg-white">
                
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <img 
                      src={Logo} 
                      alt="AapdaMitra Shield" 
                      className="w-11 h-11 sm:w-14 sm:h-14 object-contain rounded-xl sm:rounded-2xl bg-indigo-50 p-1.5 sm:p-2 border border-indigo-100 shadow-xs shrink-0" 
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg font-['Outfit'] truncate">AapdaMitra Command</h3>
                      <p className="text-[11px] sm:text-xs text-emerald-600 font-semibold flex items-center gap-1.5 truncate">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                        Emergency Network Active
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold whitespace-nowrap shrink-0">
                    v2.0 Live
                  </span>
                </div>

                {/* Instant Actions Preview */}
                <div className="space-y-3">
                  <NavLink
                    to="/safezones"
                    className="flex items-center justify-between gap-2 p-3 sm:p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0">
                        <FaHospital />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                          Safe Zones Map
                        </div>
                        <div className="text-[11px] sm:text-xs text-slate-500 truncate">Locate open shelters & medical units</div>
                      </div>
                    </div>
                    <FaArrowRight className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all text-xs shrink-0" />
                  </NavLink>

                  <NavLink
                    to="/news"
                    className="flex items-center justify-between gap-2 p-3 sm:p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div className="p-2 sm:p-2.5 rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-200 shrink-0">
                        <FaShieldAlt />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
                          Disaster Bulletins
                        </div>
                        <div className="text-[11px] sm:text-xs text-slate-500 truncate">Live verified updates & warnings</div>
                      </div>
                    </div>
                    <FaArrowRight className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all text-xs shrink-0" />
                  </NavLink>

                  <NavLink
                    to="/sosrequests"
                    className="flex items-center justify-between gap-2 p-3 sm:p-3.5 rounded-xl bg-rose-50 hover:bg-rose-100/70 border border-rose-200 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div className="p-2 sm:p-2.5 rounded-lg bg-rose-100 text-rose-700 border border-rose-200 shrink-0">
                        <FaExclamationTriangle />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-rose-900 group-hover:text-rose-950 transition-colors truncate">
                          Dispatch SOS Alert
                        </div>
                        <div className="text-[11px] sm:text-xs text-rose-700/80 truncate">Broadcast emergency coordinates</div>
                      </div>
                    </div>
                    <FaArrowRight className="text-rose-500 group-hover:translate-x-1 transition-all text-xs shrink-0" />
                  </NavLink>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-[11px] text-slate-500 leading-snug block">
                    Trusted by community volunteers and civil defense organizations.
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Live Metrics Counter Strip */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 border-y border-slate-200 bg-white shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
          {stats.map(({ value, label, detail }) => (
            <div key={label} className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
                {value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-indigo-700">
                {label}
              </div>
              <div className="text-[11px] text-slate-500 hidden sm:block">
                {detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Disaster Preparedness & Survival Protocols */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
            <FaHandsHelping /> Disaster Readiness Guide
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 font-['Outfit']">
            Emergency Preparedness Protocols
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Review essential life-saving measures before, during, and after severe weather and geological hazards.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          {Object.entries(preparednessGuides).map(([key, data]) => {
            const Icon = data.icon;
            const isSelected = activeGuide === key;
            return (
              <button
                key={key}
                onClick={() => setActiveGuide(key)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 border border-indigo-600 scale-105'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
                }`}
              >
                <Icon className={isSelected ? 'text-white' : data.color} />
                <span>{data.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Protocol Checklist Card */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl max-w-4xl mx-auto border border-slate-200 text-left bg-white shadow-md">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <span className="text-2xl font-bold text-slate-900 font-['Outfit']">
              {preparednessGuides[activeGuide].title} Action Checklist
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {preparednessGuides[activeGuide].steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <FaCheckCircle className="text-emerald-600 shrink-0 mt-1 text-sm" />
                <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Live News Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <NewsSection />
      </section>

    </div>
  );
};

export default Home;
