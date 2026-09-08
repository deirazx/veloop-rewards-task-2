import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Flame, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const RANK_THEMES = [
  {
    gradient: 'from-amber-400 to-amber-600',
    glow: 'shadow-[0_0_24px_rgba(245,158,11,0.18)]',
    border: 'border-amber-500/30',
    bg: 'bg-gradient-to-r from-amber-500/10 via-[#13131a] to-[#13131a]',
  },
  {
    gradient: 'from-slate-200 to-slate-400',
    glow: 'shadow-[0_0_20px_rgba(148,163,184,0.14)]',
    border: 'border-slate-400/30',
    bg: 'bg-gradient-to-r from-slate-400/10 via-[#13131a] to-[#13131a]',
  },
  {
    gradient: 'from-amber-600 to-amber-800',
    glow: 'shadow-[0_0_20px_rgba(180,83,9,0.14)]',
    border: 'border-amber-700/30',
    bg: 'bg-gradient-to-r from-amber-700/10 via-[#13131a] to-[#13131a]',
  },
  {
    gradient: 'from-purple-500 to-violet-600',
    glow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]',
    border: 'border-white/5',
    bg: 'bg-[#13131a]',
  },
  {
    gradient: 'from-blue-500 to-cyan-600',
    glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]',
    border: 'border-white/5',
    bg: 'bg-[#13131a]',
  },
  {
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]',
    border: 'border-white/5',
    bg: 'bg-[#13131a]',
  }
];

function RankBadge({ rank }) {
  if (rank === 1) {
    return (
      <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 text-black font-extrabold text-sm shadow-[0_0_12px_rgba(245,158,11,0.5)]">
        <Crown className="w-4 h-4 text-black" />
        <span className="sr-only">Rank 1</span>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-900 font-extrabold text-xs shadow-[0_0_10px_rgba(203,213,225,0.4)]">
        <Medal className="w-4 h-4 text-slate-900" />
        <span className="sr-only">Rank 2</span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white font-extrabold text-xs shadow-[0_0_10px_rgba(180,83,9,0.4)]">
        <Medal className="w-4 h-4 text-amber-200" />
        <span className="sr-only">Rank 3</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 border border-white/5 text-slate-400 font-bold text-xs font-mono">
      #{rank}
    </div>
  );
}

export default function Leaderboard() {
  const [filter, setFilter] = useState('ALL_TIME');
  const [showAll, setShowAll] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real leaderboard rankings from MongoDB backend
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const res = await api.fetchLeaderboard(filter);
        if (isMounted) {
          setUsers(Array.isArray(res) ? res : []);
        }
      } catch (err) {
        console.warn('[Leaderboard] API fetch failed:', err.message);
        if (isMounted) setUsers([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [filter]);

  const displayList = showAll ? users : users.slice(0, 5);

  return (
    <section className="w-full">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white leading-none">🏆 Top Leaderboard</h2>
              {users.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Flame className="w-2.5 h-2.5" /> {showAll ? `Top ${users.length}` : 'Top 5'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">Highest ranking reward hunters ranked by points & wins</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#13131a] border border-white/5 text-xs">
            <button
              onClick={() => setFilter('ALL_TIME')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                filter === 'ALL_TIME'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setFilter('THIS_WEEK')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                filter === 'THIS_WEEK'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              This Week
            </button>
          </div>

          {users.length > 5 && (
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
                text-[#a855f7] border border-purple-500/20 bg-purple-500/8
                hover:bg-purple-500/15 transition-all shrink-0 cursor-pointer"
            >
              <span>{showAll ? 'Show Top 5' : `View All (${users.length})`}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* ── Conditional Rendering: Empty State vs Data-Driven Leaderboard ── */}
      {!loading && users.length === 0 ? (
        <div className="w-full rounded-2xl bg-[#13131a] border border-white/5 p-10 sm:p-14 text-center flex flex-col items-center justify-center space-y-3 shadow-[0_0_24px_rgba(0,0,0,0.4)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 shadow-inner mb-1">
            <Trophy className="w-7 h-7 text-slate-500/70" />
          </div>
          <p className="text-sm text-gray-400 font-medium max-w-md">
            Previous winners will appear here after a giveaway is completed.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <AnimatePresence>
            {displayList.map((user, idx) => {
              const theme = RANK_THEMES[Math.min(idx, RANK_THEMES.length - 1)];
              return (
                <motion.div
                  key={`${filter}-${user.rank || idx}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl
                    ${theme.bg} border ${theme.border} hover:border-purple-500/30
                    transition-all duration-200 ${theme.glow} overflow-hidden`}
                >
                  {/* Subtle row highlight on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {/* Left: Rank + Avatar + Name */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <RankBadge rank={user.rank} />

                    {/* Avatar */}
                    <div
                      className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br ${theme.gradient}
                        flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-md overflow-hidden`}
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        user.initials || 'VE'
                      )}
                    </div>

                    {/* User details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                          {user.name}
                        </span>
                        {user.rank === 1 && (
                          <span className="hidden xs:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Sparkles className="w-2.5 h-2.5" /> Leader
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500 font-mono truncate">{user.username}</span>
                        <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-600" />
                        <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium">
                          {user.wins} Wins • {user.entries} Entries
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Points */}
                  <div className="flex flex-col items-end shrink-0 pl-3">
                    <div className="text-sm sm:text-base font-extrabold text-purple-400 font-mono tracking-tight">
                      {user.points}
                    </div>
                    <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                      {user.badge}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
