import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { 
  FaBars, 
  FaTimes, 
  FaExclamationTriangle, 
  FaSignOutAlt, 
  FaUserCircle, 
  FaLock, 
  FaHandsHelping,
  FaChevronDown,
  FaShieldAlt,
  FaTachometerAlt
} from 'react-icons/fa';
import VolunteerApplicationModal from './VolunteerApplicationModal';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const refreshUserAuth = async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return;
    try {
      const res = await fetch(`${API_URL}/api/user/check-auth`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentUser(data.user);
      }
    } catch {
      // Ignore network errors on auth check
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    try {
      setCurrentUser(JSON.parse(localStorage.getItem('user')));
    } catch {
      setCurrentUser(null);
    }
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    refreshUserAuth();
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    navigate('/login');
  };

  // Desktop navigation items (clean, deduplicated, and prioritized by role)
  const navLinks = [
    { name: 'Home', path: '/' },
    ...(currentUser?.role === 'admin'
      ? [{ name: 'Command Center', path: '/dashboard' }]
      : currentUser?.role === 'volunteer'
      ? [{ name: 'Responder Desk', path: '/dashboard' }]
      : []),
    { name: 'Safe Zones', path: '/safezones' },
    { name: 'Live News', path: '/news' },
    ...(!currentUser?.role || currentUser?.role === 'user'
      ? [{ name: 'SOS Requests', path: '/sosrequests' }]
      : []),
  ];

  // Full list for the mobile drawer
  const mobileNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Safe Zones', path: '/safezones' },
    { name: 'Live News', path: '/news' },
    { name: 'SOS Requests', path: '/sosrequests' },
    ...(currentUser?.role === 'admin'
      ? [{ name: 'Command Center', path: '/dashboard' }]
      : currentUser?.role === 'volunteer'
      ? [{ name: 'Responder Desk', path: '/dashboard' }]
      : token
      ? [{ name: 'Citizen Dashboard', path: '/dashboard' }]
      : []),
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <NavLink to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="relative shrink-0">
              <img 
                src={Logo} 
                alt="AapdaMitra Logo" 
                className="w-9 h-9 sm:w-11 sm:h-11 object-contain rounded-xl p-1 bg-indigo-50 border border-indigo-100 shadow-xs group-hover:scale-105 transition-transform duration-200" 
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>
            <div className="leading-tight min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 font-['Outfit'] group-hover:text-indigo-600 transition-colors">
                  AapdaMitra
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                  Live
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-wide hidden sm:block">
                Disaster Relief & Safety
              </p>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
            {navLinks.map(({ name, path, badge, role }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 xl:px-4 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <span className="flex items-center gap-1.5">
                  <span>{name}</span>
                  {!token && path !== '/' && (
                    <FaLock className="text-[10px] text-slate-400 group-hover:text-slate-600" title="Sign in required to access" />
                  )}
                </span>
                {badge && (
                  <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                    role === 'admin'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Action Area */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            {/* Quick Emergency SOS CTA */}
            <NavLink
              to="/sosrequests"
              className="flex items-center gap-1.5 px-3.5 py-1.5 xl:px-4 xl:py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs xl:text-sm font-bold shadow-md shadow-rose-200 hover:scale-[1.02] transition-all animate-emergency-pulse whitespace-nowrap shrink-0"
            >
              <FaExclamationTriangle className="text-amber-200 text-xs" />
              <span>SOS Alert</span>
            </NavLink>



            {/* Profile Dropdown */}
            {token ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-indigo-300 text-xs transition-all whitespace-nowrap cursor-pointer shadow-2xs"
                  aria-expanded={profileDropdownOpen}
                  aria-label="User profile menu"
                >
                  <FaUserCircle className="text-indigo-600 text-sm xl:text-base shrink-0" />
                  <span className="font-semibold text-slate-800 max-w-[85px] xl:max-w-[120px] truncate text-left">
                    {currentUser?.name || currentUser?.username || 'User'}
                  </span>
                  {currentUser?.role && (
                    <span className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded border ${
                      currentUser.role === 'admin'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : currentUser.role === 'volunteer'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {currentUser.role}
                    </span>
                  )}
                  <FaChevronDown
                    className={`text-[10px] text-slate-400 transition-transform duration-200 ${
                      profileDropdownOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
                    {/* User Identity Header */}
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate font-['Outfit']">
                        {currentUser?.name || 'Citizen'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {currentUser?.username}
                      </p>
                      <div className="mt-1.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          currentUser?.role === 'admin'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : currentUser?.role === 'volunteer'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              currentUser?.role === 'admin'
                                ? 'bg-rose-500'
                                : currentUser?.role === 'volunteer'
                                ? 'bg-emerald-500'
                                : 'bg-indigo-500'
                            }`}
                          ></span>
                          {currentUser?.role === 'admin'
                            ? 'System Administrator'
                            : currentUser?.role === 'volunteer'
                            ? 'Field Volunteer'
                            : 'Citizen Account'}
                        </span>
                      </div>
                    </div>

                    {/* Dashboard Navigation */}
                    <div className="px-1.5 py-1">
                      <NavLink
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/70 transition-colors"
                      >
                        {currentUser?.role === 'admin' ? (
                          <FaShieldAlt className="text-rose-600 text-sm shrink-0" />
                        ) : currentUser?.role === 'volunteer' ? (
                          <FaHandsHelping className="text-emerald-600 text-sm shrink-0" />
                        ) : (
                          <FaTachometerAlt className="text-indigo-600 text-sm shrink-0" />
                        )}
                        <span>
                          {currentUser?.role === 'admin'
                            ? 'Command Center'
                            : currentUser?.role === 'volunteer'
                            ? 'Responder Desk'
                            : 'Citizen Dashboard'}
                        </span>
                      </NavLink>

                      {/* Join / Status as Volunteer (For Citizens only) */}
                      {(!currentUser?.role || currentUser?.role === 'user') && (
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setShowVolunteerModal(true);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-amber-900 bg-amber-50/70 hover:bg-amber-100 border border-amber-200/70 transition-colors cursor-pointer mt-1"
                        >
                          <div className="flex items-center gap-2.5">
                            <FaHandsHelping className="text-amber-600 text-sm shrink-0" />
                            <span>Join as Volunteer</span>
                          </div>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                            Apply
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Sign Out */}
                    <div className="px-1.5 pt-1 border-t border-slate-100 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <FaSignOutAlt className="text-rose-500 text-sm shrink-0" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs xl:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition-all whitespace-nowrap shrink-0"
              >
                <FaUserCircle className="text-slate-300 text-xs" />
                <span>Sign In / Join</span>
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <NavLink
              to="/sosrequests"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md animate-emergency-pulse text-xs font-bold flex items-center gap-1 shrink-0"
            >
              <FaExclamationTriangle className="text-amber-200 text-xs" />
              <span>SOS</span>
            </NavLink>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200 text-left">
          {mobileNavLinks.map(({ name, path, badge, role }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-semibold ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              <span className="flex items-center gap-1.5">
                <span>{name}</span>
                {!token && path !== '/' && (
                  <FaLock className="text-[11px] text-slate-400" title="Sign in required to access" />
                )}
              </span>
              {badge && (
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                  role === 'admin'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {badge}
                </span>
              )}
            </NavLink>
          ))}

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {token ? (
              <>
                <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-indigo-600 text-base" />
                    <span className="font-semibold text-slate-900">
                      {currentUser?.name || currentUser?.username}
                    </span>
                  </div>
                  {currentUser?.role && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                      {currentUser.role}
                    </span>
                  )}
                </div>

                {(!currentUser?.role || currentUser?.role === 'user') && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowVolunteerModal(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs shadow-xs transition-colors"
                  >
                    <FaHandsHelping className="text-amber-600 text-sm" />
                    <span>Join as Volunteer</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800"
              >
                <FaUserCircle className="text-slate-300 text-xs" />
                <span>Sign In / Join</span>
              </NavLink>
            )}
          </div>
        </div>
      )}

      </nav>

      {/* Volunteer Application Modal */}
      <VolunteerApplicationModal
        isOpen={showVolunteerModal}
        onClose={() => setShowVolunteerModal(false)}
        onStatusUpdated={refreshUserAuth}
      />
    </>
  );
};

export default Navbar;