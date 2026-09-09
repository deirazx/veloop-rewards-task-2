import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Flame, Sparkles, TrendingUp, Gift, Star, Zap, ShieldCheck, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGiveaway } from '../../context/GiveawayContext';

/* ─── Privacy-safe masked static leaderboard data (Rule 25) ─── */
const MOCK_LEADERBOARD = [
  { rank: 1,  masked: '@ve****91', initial: 'V1', points: 12480, wins: 8,  entries: 142, change: +14, badge: 'Platinum Elite',  gradient: 'from-amber-300 to-amber-500'   },
  { rank: 2,  masked: '@ve****37', initial: 'V2', points: 10920, wins: 6,  entries: 118, change: +6,  badge: 'Gold Hunter',    gradient: 'from-slate-200 to-slate-400'   },
  { rank: 3,  masked: '@ve****04', initial: 'V3', points:  9340, wins: 5,  entries: 103, change: +2,  badge: 'Silver Racer',   gradient: 'from-amber-600 to-amber-800'   },
  { rank: 4,  masked: '@ve****62', initial: 'V4', points:  8210, wins: 4,  entries:  98, change: -3,  badge: 'Bronze Seeker',  gradient: 'from-violet-500 to-purple-600' },
  { rank: 5,  masked: '@ve****19', initial: 'V5', points:  7630, wins: 4,  entries:  91, change: +1,  badge: 'Bronze Seeker',  gradient: 'from-blue-500 to-cyan-500'     },
  { rank: 6,  masked: '@ve****88', initial: 'V6', points:  6890, wins: 3,  entries:  84, change: 0,   badge: 'Member',         gradient: 'from-emerald-500 to-teal-500'  },
  { rank: 7,  masked: '@ve****55', initial: 'V7', points:  6120, wins: 3,  entries:  77, change: +3,  badge: 'Member',         gradient: 'from-rose-500 to-pink-500'     },
  { rank: 8,  masked: '@ve****23', initial: 'V8', points:  5540, wins: 2,  entries:  69, change: -1,  badge: 'Member',         gradient: 'from-indigo-500 to-violet-500' },
  { rank: 9,  masked: '@ve****71', initial: 'V9', points:  4980, wins: 2,  entries:  62, change: +5,  badge: 'Member',         gradient: 'from-amber-400 to-orange-500'  },
  { rank: 10, masked: '@ve****46', initial: 'VA', points:  4410, wins: 1,  entries:  58, change: -2,  badge: 'Member',         gradient: 'from-cyan-500 to-blue-500'     },
];

const CURRENT_USER_MOCK = {
  rank: 128, masked: '@ve****99', points: 2840, nextRankPoints: 4410, nextRank: 10, badge: 'Member'
};

const PERIOD_TABS = ['Daily', 'Weekly', 'Monthly', 'All-Time'];

/* ─── Avatar circle ─── */
function Avatar({ initial, gradient, size = 'md' }) {
  const sz = size === 'lg' ? 'w-14 h-14 text-xl' : size === 'sm' ? 'w-8 h-8 text-xs' : 'w-11 h-11 text-sm';
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-extrabold text-white shrink-0 ring-2 ring-white/10`}>
      {initial}
    </div>
  );
}

/* ─── Change delta badge ─── */
function Delta({ value }) {
  if (value > 0) return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
      <ArrowUp className="w-2.5 h-2.5" />+{value}
    </span>
  );
  if (value < 0) return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/20">
      <ArrowDown className="w-2.5 h-2.5" />{value}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-white/5 text-slate-500 border border-white/8">
      <Minus className="w-2.5 h-2.5" />—
    </span>
  );
}

/* ─── Podium card for top 3 ─── */
function PodiumCard({ user, position }) {
  const configs = {
    1: {
      height: 'h-32 sm:h-36',
      base: 'h-14 sm:h-16',
      crown: true,
      glow: 'shadow-[0_0_40px_rgba(245,158,11,0.3)]',
      border: 'border-amber-400/50',
      bg: 'bg-gradient-to-b from-amber-500/20 via-[#1a1208] to-[#13131a]',
      label: 'bg-gradient-to-r from-amber-300 to-amber-500',
      rankText: '1st',
    },
    2: {
      height: 'h-24 sm:h-28',
      base: 'h-10 sm:h-12',
      crown: false,
      glow: 'shadow-[0_0_30px_rgba(148,163,184,0.2)]',
      border: 'border-slate-400/40',
      bg: 'bg-gradient-to-b from-slate-400/15 via-[#141418] to-[#13131a]',
      label: 'bg-gradient-to-r from-slate-300 to-slate-400',
      rankText: '2nd',
    },
    3: {
      height: 'h-20 sm:h-24',
      base: 'h-8 sm:h-10',
      crown: false,
      glow: 'shadow-[0_0_30px_rgba(180,83,9,0.2)]',
      border: 'border-amber-700/40',
      bg: 'bg-gradient-to-b from-amber-700/15 via-[#141208] to-[#13131a]',
      label: 'bg-gradient-to-r from-amber-600 to-amber-700',
      rankText: '3rd',
    },
  };
  const c = configs[position];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: position * 0.08 }}
      className="flex flex-col items-center gap-2"
    >
      {/* Crown above rank 1 */}
      {c.crown && (
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="text-amber-400 mb-1"
        >
          <Crown className="w-7 h-7 fill-amber-400" />
        </motion.div>
      )}
      {!c.crown && <div className="h-8 mb-1" />}

      {/* Avatar */}
      <div className={`relative ${c.glow} rounded-full`}>
        <Avatar initial={user.initial} gradient={user.gradient} size={position === 1 ? 'lg' : 'md'} />
        <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${c.label} flex items-center justify-center text-[9px] font-extrabold text-white shadow-lg`}>
          {position}
        </span>
      </div>

      {/* Name + points */}
      <div className="text-center">
        <p className="text-[11px] font-bold text-slate-300 font-mono">{user.masked}</p>
        <p className="text-base font-extrabold text-white mt-0.5">{user.points.toLocaleString()}</p>
        <p className="text-[9px] text-purple-400 font-semibold uppercase tracking-wider">VEs</p>
      </div>

      {/* Podium column */}
      <div className={`w-full rounded-t-2xl border ${c.border} ${c.bg} ${c.height} flex items-end justify-center pb-2`}>
        <span className={`text-xs font-extrabold ${c.label} bg-clip-text text-transparent`}>
          {c.rankText}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Main Leaderboard ─── */
export default function Leaderboard() {
  const { currentUser } = useGiveaway();
  const [period, setPeriod] = useState('All-Time');
  const [showAll, setShowAll] = useState(false);

  const top3 = MOCK_LEADERBOARD.slice(0, 3);
  const rest = MOCK_LEADERBOARD.slice(3);
  const displayRest = showAll ? rest : rest.slice(0, 4);

  const me = CURRENT_USER_MOCK;
  const progressPct = Math.round((me.points / me.nextRankPoints) * 100);

  const PERKS = [
    { icon: Trophy,    label: 'Top 10 NFT Badge',      color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20' },
    { icon: Zap,       label: '+500 Bonus VEs',         color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/20' },
    { icon: ShieldCheck, label: 'Priority Support',    color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { icon: Gift,      label: 'Exclusive Giveaways',   color: 'text-pink-400',    bg: 'bg-pink-500/10 border-pink-500/20' },
  ];

  return (
    <section className="w-full space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-none flex items-center gap-2">
              🏆 Leaderboard
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Flame className="w-2.5 h-2.5" /> Live
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Top reward hunters ranked by VEs earned</p>
          </div>
        </div>

        {/* Period tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#13131a] border border-white/5">
          {PERIOD_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setPeriod(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                period === tab
                  ? 'bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Top 3 Podium ── */}
      <div className="rounded-2xl bg-[#0c0817]/90 backdrop-blur-xl border border-purple-500/15 p-5 sm:p-8 overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(124,58,237,0.12)_0%,transparent_70%)] pointer-events-none" />

        <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
          🎖️ Top 3 Champions — {period}
        </p>

        {/* Podium layout: 2nd | 1st | 3rd */}
        <div className="grid grid-cols-3 gap-3 items-end max-w-sm mx-auto">
          <PodiumCard user={top3[1]} position={2} />
          <PodiumCard user={top3[0]} position={1} />
          <PodiumCard user={top3[2]} position={3} />
        </div>
      </div>

      {/* ── Ranks 4–10 table ── */}
      <div className="rounded-2xl bg-[#0c0817]/80 backdrop-blur-xl border border-white/8 overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/2">
          <div className="grid grid-cols-[40px_1fr_80px_52px] w-full gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
            <span>#</span>
            <span>User</span>
            <span className="text-right">VEs</span>
            <span className="text-right">Change</span>
          </div>
        </div>

        <AnimatePresence>
          {displayRest.map((user, idx) => (
            <motion.div
              key={`${period}-${user.rank}`}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18, delay: idx * 0.04 }}
              className="group flex items-center px-4 py-3 border-b border-white/4 last:border-0 hover:bg-purple-500/5 transition-colors"
            >
              <div className="grid grid-cols-[40px_1fr_80px_52px] w-full gap-2 items-center">
                {/* Rank */}
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-slate-400 font-bold text-xs font-mono">
                  {user.rank}
                </div>

                {/* Avatar + masked name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar initial={user.initial} gradient={user.gradient} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white font-mono truncate group-hover:text-purple-300 transition-colors">
                      {user.masked}
                    </p>
                    <p className="text-[10px] text-slate-500">{user.wins}W · {user.entries}E</p>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <span className="text-sm font-extrabold text-purple-400 font-mono">{user.points.toLocaleString()}</span>
                  <span className="block text-[9px] text-slate-600">VEs</span>
                </div>

                {/* Change delta */}
                <div className="flex justify-end">
                  <Delta value={user.change} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Show more toggle */}
        {rest.length > 4 && (
          <div className="px-4 py-3 border-t border-white/5 flex justify-center">
            <button
              onClick={() => setShowAll((p) => !p)}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors"
            >
              {showAll ? 'Show less' : `View all (Rank 7–10+)`}
              <Star className={`w-3 h-3 transition-transform ${showAll ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* ── Current User sticky footer card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-[#6366F1]/15 via-[#0c0817] to-[#7C3AED]/15 border border-purple-500/30 p-4 sm:p-5 shadow-[0_0_30px_rgba(124,58,237,0.15)]"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#7C3AED] flex items-center justify-center text-white font-bold text-sm ring-2 ring-purple-500/40">
              {currentUser ? currentUser.customUserId?.slice(-2) || 'ME' : 'ME'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white">Your Rank</p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 border border-purple-500/30 text-purple-300">
                  #{me.rank}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{me.masked}</p>
            </div>
          </div>

          <div className="flex-1 min-w-[180px]">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">{me.points.toLocaleString()} VEs</span>
              <span className="text-purple-400 font-semibold">→ Rank #{me.nextRank}: {me.nextRankPoints.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/8 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#a855f7] shadow-[0_0_8px_rgba(124,58,237,0.6)]"
              />
            </div>
            <p className="text-[10px] text-slate-600 mt-1">{progressPct}% to next rank</p>
          </div>

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-lg font-extrabold text-white font-mono">{me.points.toLocaleString()}</span>
            <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">Total VEs</span>
          </div>
        </div>
      </motion.div>

      {/* ── Leaderboard Perks ── */}
      <div className="rounded-2xl bg-[#0c0817]/80 border border-white/8 p-4 sm:p-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Top Performer Perks
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PERKS.map(({ icon: Icon, label, color, bg }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${bg} text-center`}
            >
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-[11px] font-semibold text-slate-300 leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
