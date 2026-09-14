import React, { useState, useEffect } from 'react';
import NewsSection from './NewsSection';
import { FaExclamationTriangle, FaBullhorn, FaShieldAlt, FaClock } from 'react-icons/fa';

const News = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loadingBroadcasts, setLoadingBroadcasts] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/broadcasts')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setBroadcasts(json.data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch broadcasts on news page:', err);
      })
      .finally(() => {
        setLoadingBroadcasts(false);
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
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <div className="flex flex-col w-full min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-left">
      
      {/* 24-Hour Admin Emergency Broadcasts Banner Section */}
      {broadcasts.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-rose-300 flex items-center gap-2 font-['Outfit']">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>🚨 Official Admin Emergency Broadcasts (Active 24 Hours)</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">
              Auto-purges after 24 hours
            </span>
          </div>

          <div className="grid gap-3">
            {broadcasts.map((b) => {
              const isCrit = b.severity === 'CRITICAL';
              const isWarn = b.severity === 'WARNING';

              return (
                <div
                  key={b._id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isCrit
                      ? 'bg-gradient-to-r from-rose-950/70 to-[#1e2344] border-rose-500/40 shadow-lg shadow-rose-950/30'
                      : isWarn
                      ? 'bg-gradient-to-r from-amber-950/60 to-[#1e2344] border-amber-500/40 shadow-lg shadow-amber-950/20'
                      : 'bg-gradient-to-r from-blue-950/60 to-[#1e2344] border-blue-500/40 shadow-lg shadow-blue-950/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <FaBullhorn
                        className={`text-lg shrink-0 mt-0.5 ${
                          isCrit ? 'text-rose-400 animate-pulse' : isWarn ? 'text-amber-400' : 'text-blue-400'
                        }`}
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                              isCrit
                                ? 'bg-rose-500/25 text-rose-300 border-rose-500/40'
                                : isWarn
                                ? 'bg-amber-500/25 text-amber-300 border-amber-500/40'
                                : 'bg-blue-500/25 text-blue-300 border-blue-500/40'
                            }`}
                          >
                            {b.severity} ALERT
                          </span>
                          <span className="text-[11px] text-slate-300">• By {b.author}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-slate-300 border border-white/10 font-mono">
                            ⏳ {getTimeRemaining(b.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base font-bold text-white leading-snug">
                          {b.title}
                        </p>
                        {b.message && (
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {b.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-xl bg-white/10 text-white text-[11px] font-bold shrink-0 border border-white/15">
                      Verified Directive
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Default Meteorological Advisory Ticker if no custom Admin broadcast is currently active */
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-200 text-xs">
          <div className="flex items-center gap-2 font-semibold">
            <FaExclamationTriangle className="text-amber-400 shrink-0 text-sm" />
            <span>OFFICIAL METEOROLOGICAL ADVISORY: Monitoring cyclonic formations and river discharge levels across coastal & river basin zones.</span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider text-[10px] shrink-0">
            Live Feed
          </span>
        </div>
      )}

      <NewsSection />
    </div>
  );
};

export default News;
