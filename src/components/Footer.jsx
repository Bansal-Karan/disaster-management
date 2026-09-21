import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaPhoneAlt, FaShieldAlt, FaMapMarkerAlt, FaAmbulance, FaFireExtinguisher, FaHeart } from 'react-icons/fa';

const emergencyNumbers = [
  { label: 'National Emergency', number: '112', icon: FaShieldAlt, color: 'text-amber-400' },
  { label: 'Ambulance & Medical', number: '108', icon: FaAmbulance, color: 'text-rose-400' },
  { label: 'Disaster Helpline', number: '1078', icon: FaShieldAlt, color: 'text-sky-400' },
  { label: 'Fire & Rescue', number: '101', icon: FaFireExtinguisher, color: 'text-orange-400' },
];

const Footer = () => {
  return (
    <footer className="mt-auto bg-[#0a1128] border-t border-slate-200 text-slate-300 text-left">
      {/* Emergency Hotlines Strip */}
      <div className="bg-[#0f172a] border-b border-white/10 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-rose-400">
              24/7 Emergency Hotlines (Toll-Free in India)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            {emergencyNumbers.map(({ label, number, icon: Icon, color }) => (
              <a
                key={number}
                href={`tel:${number}`}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all text-xs group"
              >
                <Icon className={`${color} group-hover:scale-110 transition-transform`} />
                <div>
                  <span className="block text-[10px] text-slate-400">{label}</span>
                  <span className="font-bold text-white tracking-wider">{number}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: About */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-white font-['Outfit'] tracking-tight">
                AapdaMitra Platform
              </span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                Active & Operational
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Empowering communities with real-time disaster alerts, GPS-enabled SOS emergency dispatch, verified safe shelters, and life-saving coordination during critical natural disasters.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All emergency feeds & evacuation maps live</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <NavLink to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home Overview
                </NavLink>
              </li>
              <li>
                <NavLink to="/safezones" className="text-slate-400 hover:text-white transition-colors">
                  Safe Zones & Shelters
                </NavLink>
              </li>
              <li>
                <NavLink to="/news" className="text-slate-400 hover:text-white transition-colors">
                  Live Disaster Bulletins
                </NavLink>
              </li>
              <li>
                <NavLink to="/sosrequests" className="text-slate-400 hover:text-rose-400 transition-colors font-medium">
                  Dispatch SOS Alert
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Col 3: Safe Practices */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-3">
              Crisis Protocol
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Keep battery packs fully charged</li>
              <li>• Store emergency water & dry food</li>
              <li>• Memorize your nearest Safe Zone</li>
              <li>• Follow NDRF & SDRF official directives</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} AapdaMitra Emergency Management. Designed & Developed by Karan Bansal.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Built for rapid humanitarian response</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
