import React, { useState } from 'react';
import { Trophy, Crown, Medal, ArrowRight, Flame, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_TIME_USERS = [
  {
    rank: 1,
    name: 'Rahul K.',
    username: '@rahul_crypto',
    points: '15,420 pts',
    entries: 142,
    wins: 9,
    badge: 'Legendary',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    initials: 'RK',
    gradient: 'from-amber-400 to-amber-600',
    glow: 'shadow-[0_0_24px_rgba(245,158,11,0.18)]',
    border: 'border-amber-500/30',
    bg: 'bg-gradient-to-r from-amber-500/10 via-[#13131a] to-[#13131a]',
  },
  {
    rank: 2,
    name: 'Sneha M.',
    username: '@sneha_tech',
    points: '12,850 pts',
    entries: 118,
    wins: 7,
    badge: 'Master',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    initials: 'SM',
    gradient: 'from-slate-200 to-slate-400',
    glow: 'shadow-[0_0_20px_rgba(148,163,184,0.14)]',
    border: 'border-slate-400/30',
    bg: 'bg-gradient-to-r from-slate-400/10 via-[#13131a] to-[#13131a]',
  },
  {
    rank: 3,
    name: 'Aman V.',
    username: '@aman_v',
    points: '10,940 pts',
    entries: 95,
    wins: 5,
    badge: 'Elite',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    initials: 'AV',
    gradient: 'from-amber-600 to-amber-800',
    glow: 'shadow-[0_0_20px_rgba(180,83,9,0.14)]',
    border: 'border-amber-700/30',
    bg: 'bg-gradient-to-r from-amber-700/10 via-[#13131a] to-[#13131a]',
  },
  {
    rank: 4,
    name: 'Tanvi S.',
    username: '@tanvi_09',
    points: '8,730 pts',
    entries: 74,
    wins: 4,
    badge: 'Diamond',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    initials: 'TS',
    gradient: 'from-purple-500 to-violet-600',
    glow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]',
    border: 'border-white/5',
    bg: 'bg-[#13131a]',
  },
  {
    rank: 5,
    name: 'Devraj P.',
    username: '@devraj_pro',
    points: '7,150 pts',
    entries: 62,
    wins: 3,
    badge: 'Platinum',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    initials: 'DP',
    gradient: 'from-blue-500 to-cyan-600',
    glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]',
    border: 'border-white/5',
    bg: 'bg-[#13131a]',
  },
  {
    rank: 6,
    name: 'Arjun S.',
    username: '@arjun_singh',
    points: '6,420 pts',
    entries: 55,
    wins: 3,
    badge: 'Gold',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    initials: 'AS',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]',
    border: 'border-white/5',
    bg: 'bg-[#13131a]',
  },
  {
    rank: 7,
    name: 'Priya M.',
    username: '@priya_m',
    points: '5,890 pts',
    entries: 48,
    wins: 2,
    badge: 'Gold',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    initials: 'PM',
    gradient: 'from-rose-500 to-pink-600',
    glow: 'hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]',
    border: 'border-white/5',
    bg: 'bg-[#13131a]',
  },
  {
    rank: 8,
    name: 'Vikram M.',
    username: '@vikram_m',
    points: '5,120 pts',
    entries: 41,
    wins: 2,
    badge: 'Silver',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    initials: 'VM',
    gradient: 'from-indigo-500 to-purple-600',
    glow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]',
    border: 'border-white/5',
    bg: 'bg-[#13131a]',
  },
  {
    rank: 9,
    name: 'Ananya R.',
    username: '@ananya_roy',
    points: '4,680 pts',
    entries: 37,
    wins: 2,
    badge: 'Silver',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    initials: 'AR',
    gradient: 'from-fuchsia-500 to-pink-600',
    glow: 'hover:shadow-[0_0_20px_rgba(217,70,239,0.1)]',
    border: 'border-white/5',
    bg: 'bg-[#13131a]',
  },
  {
    rank: 10,
    name: 'Rohan V.',
    username: '@rohan_v',
    points: '4,150 pts',
    entries: 33,
    wins: 1,
    badge: 'Bronze',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    initials: 'RV',
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]',
    border: 'border-white/5',
    bg: 'bg-[#13131a]',
  },
];

const THIS_WEEK_USERS = [
  {
    rank: 1,
    name: 'Sneha M.',
    username: '@sneha_tech',
    points: '4,210 pts',
    entries: 38,
    wins: 3,
    badge: 'Weekly Champion',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    initials: 'SM',
    gradient: 'from-amber-400 to-amber-600',
    glow: 'shadow-[0_0_24px_rgba(245,158,11,0.18)]',
    border: 'border-amber-500/30',
    bg: 'bg-gradient-to-r from-amber-500/10 via-[#13131a] to-[#13131a]',
  },
  {
    rank: 2,
    name: 'Devraj P.',
    username: '@devraj_pro',
    points: '3,890 pts',
    entries: 31,
    wins: 2,
    badge: 'Hot Streak',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    initials: 'DP',
    gradient: 'from-slate-200 to-slate-400',
    glow: 'shadow-[0_0_20px_rgba(148,163,184,0.14)]',
    border: 'border-slate-400/30',
    bg: 'bg-gradient-to-r from-slate-400/10 via-[#13131a] to-[#13131a]',
  },
  {
    rank: 3,
    name: 'Rahul K.',
    username: '@rahul_crypto',
    points: '3,650 pts',
    entries: 29,
    wins: 2,
    badge: 'Contender',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    initials: 'RK',
    gradient: 'from-amber-600 to-amber-800',
    glow: 'shadow-[0_0_20px_rgba(180,83,9,0.14)]',
    border: 'border-amber-700/30',
    bg: 'bg-gradient-to-r from-amber-700/10 via-[#13131a] to-[#13131a]',
  },
  {
    rank: 4,
    name: 'Ananya R.',
    username: '@ananya_roy',
    points: '2,940 pts',
    entries: 24,
    wins: 1,
    badge: 'Rising',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    initials: 'AR',
    gradient: 'from-purple-500 to-violet-600',
    glow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]',
    border: 'border-white/5',
    bg: 'bg-[#13131a]',
  },
  {
    rank: 5,
    name: 'Aman V.',
    username: '@aman_v',
    points: '2,510 pts',
    entries: 20,
    wins: 1,
    badge: 'Competitor',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    initials: 'AV',
    gradient: 'from-blue-500 to-cyan-600',
    glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]',
    border: 'border-white/5',
    bg: 'bg-[#13131a]',
  },
  {
    rank: 6,
    name: 'Tanvi S.',
    username: '@tanvi_09',
    points: '2,180 pts',
    entries: 17,
    wins: 1,
    badge: 'Challenger',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    initials: 'TS',
    gradient: 'from-purple-500 to-violet-600',
    glow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]',
    border: 'border-white/5',
    bg: 'bg-[#13131a]',
  },
  {
    rank: 7,
    name: 'Rohan V.',
    username: '@rohan_v',
    points: '1,920 pts',
    entries: 15,
    wins: 1,
    badge: 'Active',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    initials: 'RV',
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]',
    border: 'border-white/5',
    bg: 'bg-[#13131a]',
  },
  {
    rank: 8,
    name: 'Arjun S.',
    username: '@arjun_singh',
    points: '1,640 pts',
    entries: 12,
    wins: 1,
    badge: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    initials: 'AS',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]',
    border: 'border-white/5',
    bg: 'bg-[#13131a]',
  },
  {
    rank: 9,
    name: 'Vikram M.',
    username: '@vikram_m',
    points: '1,380 pts',
    entries: 10,
    wins: 0,
    badge: 'Grinder',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    initials: 'VM',
    gradient: 'from-indigo-500 to-purple-600',
    glow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]',
    border: 'border-white/5',
    bg: 'bg-[#13131a]',
  },
  {
    rank: 10,
    name: 'Priya M.',
    username: '@priya_m',
    points: '1,120 pts',
    entries: 8,
    wins: 0,
    badge: 'Participant',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    initials: 'PM',
    gradient: 'from-rose-500 to-pink-600',
    glow: 'hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]',
    border: 'border-white/5',
    bg: 'bg-[#13131a]',
  },
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

  const rawList = filter === 'ALL_TIME' ? ALL_TIME_USERS : THIS_WEEK_USERS;
  const displayList = showAll ? rawList : rawList.slice(0, 5);

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
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Flame className="w-2.5 h-2.5" /> {showAll ? 'Top 10' : 'Top 5'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Highest ranking reward hunters ranked by points & wins</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#13131a] border border-white/5 text-xs">
            <button
              onClick={() => setFilter('ALL_TIME')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === 'ALL_TIME'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setFilter('THIS_WEEK')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === 'THIS_WEEK'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              This Week
            </button>
          </div>

          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
              text-[#a855f7] border border-purple-500/20 bg-purple-500/8
              hover:bg-purple-500/15 transition-all shrink-0 cursor-pointer"
          >
            <span>{showAll ? 'Show Top 5' : 'View All (10)'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Leaderboard List ── */}
      <div className="flex flex-col gap-2.5">
        <AnimatePresence>
          {displayList.map((user) => (
            <motion.div
              key={`${filter}-${user.rank}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl
                ${user.bg} border ${user.border} hover:border-purple-500/30
                transition-all duration-200 ${user.glow} overflow-hidden`}
            >
              {/* Subtle row highlight on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Left: Rank + Avatar + Name */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <RankBadge rank={user.rank} />

                {/* Avatar */}
                <div
                  className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br ${user.gradient}
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
                    user.initials
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
                    <span className="text-xs text-slate-500 truncate">{user.username}</span>
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
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
