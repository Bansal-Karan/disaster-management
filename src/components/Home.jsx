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
  { value: '45+', label: 'Verified Safe Zones', detail: 'Real-time capacity tracking' },
  { value: '< 6 Min', label: 'Average Response Time', detail: 'Emergency dispatch coordination' },
  { value: '1,450+', label: 'Volunteers on Standby', detail: 'Certified medical & rescue teams' },
  { value: '24 / 7', label: 'Active Command Center', detail: 'Direct link to state helplines' },
];

const preparednessGuides = {
  floods: {
    title: 'Flood Protocol',
    icon: FaWater,
    color: 'text-cyan-400',
    steps: [
      'Move immediately to higher ground; avoid walking or driving through moving water.',
      'Disconnect electrical appliances to prevent electrocution.',
      'Drink only bottled or boiled water to avoid waterborne contaminants.',
      'Listen to official radio and SMS alerts; do not return home until instructed.',
    ],
  },
  earthquake: {
    title: 'Earthquake Protocol',
    icon: FaShieldAlt,
    color: 'text-amber-400',
    steps: [
      'DROP to the floor, COVER under a sturdy desk or table, and HOLD ON.',
      'Stay away from glass windows, heavy lighting, and tall bookshelves.',
      'If outdoors, move away from buildings, streetlights, and utility wires.',
      'After shocks cease, check for gas leaks and evacuate using stairs—not elevators.',
    ],
  },
  cyclone: {
    title: 'Cyclone Protocol',
    icon: FaWind,
    color: 'text-indigo-400',
    steps: [
      'Secure windows and doors; shutter or board large glass panes.',
      'Store adequate clean water, dry foods, battery packs, and emergency first aid.',
      'Remain indoors in the strongest part of the house until the eye of the storm passes.',
      'Keep emergency radio tuned to Indian Meteorological Department (IMD) bulletins.',
    ],
  },
  fire: {
    title: 'Fire Outbreak Protocol',
    icon: FaFire,
    color: 'text-rose-400',
    steps: [
      'Crawl low under heavy smoke where air is cleaner and cooler.',
      'Feel doorknobs with the back of your hand before opening; if hot, seek another exit.',
      'Use stairwells immediately; never use elevators during a structural fire.',
      'Call emergency dispatch (101 / 112) as soon as you reach a safe muster point.',
    ],
  },
};

const Home = () => {
  const [activeGuide, setActiveGuide] = useState('floods');
  const [broadcasts, setBroadcasts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/broadcasts')
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

  const getTimeRemaining = (createdAt) => {
    if (!createdAt) return '24h Active';
    const created = new Date(createdAt).getTime();
    const expiresAt = created + 24 * 60 * 60 * 1000;
    const remainingMs = expiresAt - Date.now();
    if (remainingMs <= 0) return 'Expired';
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  };

  return (
    <div className="flex flex-col w-full pt-20">
      
      {/* Active 24-Hour Admin Crisis Broadcast Ribbon */}
      {broadcasts.length > 0 && (
        <div className="w-full bg-gradient-to-r from-rose-900/90 via-[#221028]/95 to-rose-950/90 border-b border-rose-500/40 px-4 py-3 text-left shadow-xl backdrop-blur-md animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <span className="flex h-3 w-3 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 border border-rose-500/50 tracking-wider">
                  {broadcasts[0].severity} DIRECTIVE
                </span>
                <span className="text-xs sm:text-sm font-bold text-white">
                  {broadcasts[0].title}
                </span>
                <span className="text-[11px] text-rose-300/80 font-mono hidden sm:inline">
                  • ⏳ {getTimeRemaining(broadcasts[0].createdAt)} (24h Window)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
              <NavLink
                to="/news"
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center gap-1.5"
              >
                <span>View Directives ({broadcasts.length})</span>
                <FaArrowRight className="text-[10px]" />
              </NavLink>
              <NavLink
                to="/safezones"
                className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all"
              >
                Find Shelters
              </NavLink>
            </div>
          </div>
        </div>
      )}

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Glow ambient backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold tracking-wide">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              24/7 National Crisis & Emergency Dispatch
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight font-['Outfit']">
              Rapid Response When <br />
              <span className="bg-gradient-to-r from-rose-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
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
                className="text-lg sm:text-xl font-medium text-slate-300"
              />
            </div>

            <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
              Connect immediately with nearby relief shelters, send verified GPS-tagged emergency requests to responders, and receive real-time crisis bulletins.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <NavLink
                to="/sosrequests"
                className="flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-base shadow-xl shadow-rose-950/40 hover:shadow-rose-900/60 hover:scale-[1.02] transition-all animate-emergency-pulse"
              >
                <FaExclamationTriangle className="text-amber-300" />
                <span>Send Emergency SOS</span>
              </NavLink>

              <NavLink
                to="/safezones"
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-base backdrop-blur-md hover:scale-[1.02] transition-all"
              >
                <FaMapMarkedAlt className="text-emerald-400" />
                <span>Find Safe Shelters</span>
              </NavLink>
            </div>

            {/* Quick Helpline Strip */}
            <div className="pt-4 flex items-center gap-4 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Quick Helplines:</span>
              <a href="tel:112" className="hover:text-rose-300 font-bold underline">112 (National)</a>
              <span>•</span>
              <a href="tel:108" className="hover:text-rose-300 font-bold underline">108 (Ambulance)</a>
              <span>•</span>
              <a href="tel:1078" className="hover:text-rose-300 font-bold underline">1078 (Disaster)</a>
            </div>

          </div>

          {/* Right Hero Column: Interactive Card Display */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl relative z-10 border border-white/15 space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <img 
                      src={Logo} 
                      alt="AapdaMitra Shield" 
                      className="w-14 h-14 object-contain rounded-2xl bg-white/10 p-2 border border-white/20 shadow-inner" 
                    />
                    <div>
                      <h3 className="font-bold text-white text-lg font-['Outfit']">AapdaMitra Command</h3>
                      <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Emergency Network Active
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                    v2.0 Live
                  </span>
                </div>

                {/* Instant Actions Preview */}
                <div className="space-y-3">
                  <NavLink
                    to="/safezones"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <FaHospital />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          Safe Zones Map
                        </div>
                        <div className="text-xs text-slate-400">Locate open shelters & medical units</div>
                      </div>
                    </div>
                    <FaArrowRight className="text-slate-400 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all text-xs" />
                  </NavLink>

                  <NavLink
                    to="/news"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        <FaShieldAlt />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          Disaster Bulletins
                        </div>
                        <div className="text-xs text-slate-400">Live verified updates & warnings</div>
                      </div>
                    </div>
                    <FaArrowRight className="text-slate-400 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all text-xs" />
                  </NavLink>

                  <NavLink
                    to="/sosrequests"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-rose-500/30 text-rose-300 border border-rose-500/40">
                        <FaExclamationTriangle />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-rose-200 group-hover:text-rose-100 transition-colors">
                          Dispatch SOS Alert
                        </div>
                        <div className="text-xs text-rose-300/70">Broadcast emergency coordinates</div>
                      </div>
                    </div>
                    <FaArrowRight className="text-rose-300 group-hover:translate-x-1 transition-all text-xs" />
                  </NavLink>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-[11px] text-slate-400">
                    Trusted by community volunteers and civil defense organizations.
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Live Metrics Counter Strip */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 border-y border-white/10 bg-[#1b203d]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label, detail }) => (
            <div key={label} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
                {value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-indigo-300">
                {label}
              </div>
              <div className="text-[11px] text-slate-400 hidden sm:block">
                {detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Disaster Preparedness & Survival Protocols */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            <FaHandsHelping /> Disaster Readiness Guide
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-['Outfit']">
            Emergency Preparedness Protocols
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Review essential life-saving measures before, during, and after severe weather and geological hazards.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {Object.entries(preparednessGuides).map(([key, data]) => {
            const Icon = data.icon;
            const isSelected = activeGuide === key;
            return (
              <button
                key={key}
                onClick={() => setActiveGuide(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 border border-indigo-400/40 scale-105'
                    : 'glass-card text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={isSelected ? 'text-white' : data.color} />
                <span>{data.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Protocol Checklist Card */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl max-w-4xl mx-auto border border-white/10 text-left">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <span className="text-2xl font-bold text-white font-['Outfit']">
              {preparednessGuides[activeGuide].title} Action Checklist
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {preparednessGuides[activeGuide].steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <FaCheckCircle className="text-emerald-400 shrink-0 mt-1 text-sm" />
                <span className="text-xs sm:text-sm text-slate-200 leading-relaxed">
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
