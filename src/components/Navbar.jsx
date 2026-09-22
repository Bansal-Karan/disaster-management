import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { FaBars, FaTimes, FaExclamationTriangle, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    try {
      setCurrentUser(JSON.parse(localStorage.getItem('user')));
    } catch {
      setCurrentUser(null);
    }
    setMobileMenuOpen(false);
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
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative">
              <img 
                src={Logo} 
                alt="AapdaMitra Logo" 
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain rounded-xl p-1 bg-indigo-50 border border-indigo-100 shadow-xs group-hover:scale-105 transition-transform duration-200" 
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-['Outfit'] group-hover:text-indigo-600 transition-colors">
                  AapdaMitra
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
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
                <span>{name}</span>
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

            {/* Auth Button & User Profile */}
            {token ? (
              <div className="flex items-center gap-1.5 xl:gap-2">
                <NavLink
                  to="/dashboard"
                  className="flex items-center gap-2 px-2.5 py-1.5 xl:px-3.5 xl:py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-indigo-300 text-xs transition-all whitespace-nowrap shrink-0"
                  title="Open Command Dashboard"
                >
                  <FaUserCircle className="text-indigo-600 text-sm xl:text-base shrink-0" />
                  <span className="font-semibold text-slate-800 max-w-[80px] xl:max-w-[110px] truncate">
                    {currentUser?.name || currentUser?.username || 'User'}
                  </span>
                  {currentUser?.role && (
                    <span className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded border ${
                      currentUser.role === 'admin'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : currentUser.role === 'volunteer'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}>
                      {currentUser.role}
                    </span>
                  )}
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all whitespace-nowrap shrink-0"
                  title="Log out"
                >
                  <FaSignOutAlt className="text-slate-400 text-xs" />
                  <span className="hidden xl:inline">Logout</span>
                </button>
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
          <div className="flex lg:hidden items-center gap-2">
            <NavLink
              to="/sosrequests"
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md animate-emergency-pulse text-xs font-bold flex items-center gap-1"
            >
              <FaExclamationTriangle className="text-amber-200 text-xs" />
              <span>SOS</span>
            </NavLink>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
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
              <span>{name}</span>
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

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
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
  );
};

export default Navbar;