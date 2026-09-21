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
    <div className="flex flex-col w-full min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-left">
      
      {/* High-Priority Public Safety Directives Section */}
      {broadcasts.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-rose-700 flex items-center gap-2 font-['Outfit']">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
              <span>🚨 High-Priority Public Safety Directives</span>
            </h2>
            <span className="text-[11px] text-emerald-700 font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center gap-1 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Verified Updates</span>
            </span>
          </div>

          <div className="grid gap-3">
            {broadcasts.map((b) => {
              const isCrit = b.severity === 'CRITICAL';
              const isWarn = b.severity === 'WARNING';
              const cleanAuthor = b.author ? b.author.replace('(Admin)', '').trim() : 'Disaster Relief Coordination Desk';

              return (
                <div
                  key={b._id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all bg-white shadow-xs ${
                    isCrit
                      ? 'border-l-4 border-l-rose-600 border-rose-200 bg-rose-50/30'
                      : isWarn
                      ? 'border-l-4 border-l-amber-500 border-amber-200 bg-amber-50/30'
                      : 'border-l-4 border-l-blue-600 border-blue-200 bg-blue-50/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <FaBullhorn
                        className={`text-lg shrink-0 mt-0.5 ${
                          isCrit ? 'text-rose-600 animate-pulse' : isWarn ? 'text-amber-600' : 'text-blue-600'
                        }`}
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                              isCrit
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : isWarn
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-blue-100 text-blue-800 border-blue-300'
                            }`}
                          >
                            {b.severity} ALERT
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">• Issued by {cleanAuthor}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-mono flex items-center gap-1">
                            <FaClock className="text-[9px] text-slate-400" />
                            <span>{getTimeAgo(b.createdAt)}</span>
                          </span>
                        </div>
                        <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {b.title}
                        </p>
                        {b.message && (
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {b.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold shrink-0 border border-slate-200">
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
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 text-xs shadow-xs">
          <div className="flex items-center gap-2 font-semibold">
            <FaExclamationTriangle className="text-amber-600 shrink-0 text-sm" />
            <span>OFFICIAL METEOROLOGICAL ADVISORY: Monitoring cyclonic systems in the Bay of Bengal / Arabian Sea and river discharge levels across Indian basins.</span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold uppercase tracking-wider text-[10px] shrink-0 border border-amber-200">
            India Feed
          </span>
        </div>
      )}

      <NewsSection />
    </div>
  );
};

export default News;
