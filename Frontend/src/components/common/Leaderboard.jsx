import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, Crown, Medal, Flame, Sparkles, TrendingUp, Gift, Star, Zap, 
  ShieldCheck, ArrowUp, ArrowDown, Minus, Clock, Search, ChevronDown, 
  ChevronUp, Award, Target, Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGiveaway } from '../../context/GiveawayContext';

/* ─── Multi-Period Curated Leaderboard Datasets ─── */
const LEADERBOARD_PERIOD_DATA = {
  'Weekly': [
    { rank: 1,  masked: '@crypto_king91', initial: 'CK', points: 12480, wins: 8,  entries: 142, change: +14, badge: 'Diamond Warlord', streak: '🔥 8 Win Streak', gradient: 'from-amber-300 via-amber-400 to-yellow-500' },
    { rank: 2,  masked: '@apex_hunter37', initial: 'AH', points: 10920, wins: 6,  entries: 118, change: +6,  badge: 'Platinum Hunter', streak: '⚡ 6 Win Streak', gradient: 'from-slate-200 via-cyan-100 to-slate-400' },
    { rank: 3,  masked: '@cyber_wolf04',  initial: 'CW', points:  9340, wins: 5,  entries: 103, change: +2,  badge: 'Gold Striker',    streak: '🎯 5 Win Streak', gradient: 'from-amber-600 via-orange-500 to-amber-700' },
    { rank: 4,  masked: '@ve****62',      initial: 'V4', points:  8210, wins: 4,  entries:  98, change: -3,  badge: 'Bronze Seeker',   streak: '✨ 4 Wins',       gradient: 'from-violet-500 to-purple-600' },
    { rank: 5,  masked: '@ve****19',      initial: 'V5', points:  7630, wins: 4,  entries:  91, change: +1,  badge: 'Bronze Seeker',   streak: '✨ 4 Wins',       gradient: 'from-blue-500 to-cyan-500' },
    { rank: 6,  masked: '@ve****88',      initial: 'V6', points:  6890, wins: 3,  entries:  84, change: 0,   badge: 'Active Hunter',   streak: '⚡ 3 Wins',       gradient: 'from-emerald-500 to-teal-500' },
    { rank: 7,  masked: '@ve****55',      initial: 'V7', points:  6120, wins: 3,  entries:  77, change: +3,  badge: 'Active Hunter',   streak: '⚡ 3 Wins',       gradient: 'from-rose-500 to-pink-500' },
    { rank: 8,  masked: '@ve****23',      initial: 'V8', points:  5540, wins: 2,  entries:  69, change: -1,  badge: 'Challenger',      streak: '🎯 2 Wins',       gradient: 'from-indigo-500 to-violet-500' },
    { rank: 9,  masked: '@ve****71',      initial: 'V9', points:  4980, wins: 2,  entries:  62, change: +5,  badge: 'Challenger',      streak: '🎯 2 Wins',       gradient: 'from-amber-400 to-orange-500' },
    { rank: 10, masked: '@ve****46',      initial: 'VA', points:  4410, wins: 1,  entries:  58, change: -2,  badge: 'Challenger',      streak: '✨ 1 Win',        gradient: 'from-cyan-500 to-blue-500' },
  ],
  'Daily': [
    { rank: 1,  masked: '@sol_raider22',  initial: 'SR', points:  3850, wins: 4,  entries:  42, change: +22, badge: 'Daily Blitz Ace', streak: '🔥 4 Blitz Wins', gradient: 'from-amber-300 via-amber-400 to-yellow-500' },
    { rank: 2,  masked: '@crypto_king91', initial: 'CK', points:  3420, wins: 3,  entries:  38, change: +8,  badge: 'Diamond Warlord', streak: '⚡ 3 Blitz Wins', gradient: 'from-slate-200 via-cyan-100 to-slate-400' },
    { rank: 3,  masked: '@neon_ghost88',  initial: 'NG', points:  3110, wins: 2,  entries:  35, change: +15, badge: 'Speed Demon',     streak: '🎯 2 Blitz Wins', gradient: 'from-amber-600 via-orange-500 to-amber-700' },
    { rank: 4,  masked: '@luna_spark',    initial: 'LS', points:  2890, wins: 2,  entries:  31, change: +4,  badge: 'Star Hunter',     streak: '✨ 2 Wins',       gradient: 'from-violet-500 to-purple-600' },
    { rank: 5,  masked: '@cyber_wolf04',  initial: 'CW', points:  2640, wins: 2,  entries:  29, change: -1,  badge: 'Gold Striker',    streak: '✨ 2 Wins',       gradient: 'from-blue-500 to-cyan-500' },
    { rank: 6,  masked: '@pixel_blade',   initial: 'PB', points:  2350, wins: 1,  entries:  26, change: +5,  badge: 'Rookie Master',   streak: '⚡ 1 Win',        gradient: 'from-emerald-500 to-teal-500' },
    { rank: 7,  masked: '@shadow_runner', initial: 'SR', points:  2100, wins: 1,  entries:  24, change: +2,  badge: 'Rookie Master',   streak: '⚡ 1 Win',        gradient: 'from-rose-500 to-pink-500' },
    { rank: 8,  masked: '@apex_hunter37', initial: 'AH', points:  1920, wins: 1,  entries:  21, change: -2,  badge: 'Platinum Hunter', streak: '🎯 1 Win',        gradient: 'from-indigo-500 to-violet-500' },
    { rank: 9,  masked: '@quantum_zap',   initial: 'QZ', points:  1740, wins: 1,  entries:  19, change: +3,  badge: 'Challenger',      streak: '🎯 1 Win',        gradient: 'from-amber-400 to-orange-500' },
    { rank: 10, masked: '@nova_pulse',    initial: 'NP', points:  1580, wins: 0,  entries:  18, change: -1,  badge: 'Challenger',      streak: '✨ Active',       gradient: 'from-cyan-500 to-blue-500' },
  ],
  'Monthly': [
    { rank: 1,  masked: '@valkyrie_x',    initial: 'VX', points: 48200, wins: 28, entries: 490, change: +35, badge: 'Apex Overlord',   streak: '👑 28 Wins',      gradient: 'from-amber-300 via-amber-400 to-yellow-500' },
    { rank: 2,  masked: '@crypto_king91', initial: 'CK', points: 44150, wins: 24, entries: 420, change: +12, badge: 'Diamond Warlord', streak: '⚡ 24 Wins',      gradient: 'from-slate-200 via-cyan-100 to-slate-400' },
    { rank: 3,  masked: '@apex_hunter37', initial: 'AH', points: 39800, wins: 21, entries: 380, change: +9,  badge: 'Platinum Hunter', streak: '🎯 21 Wins',      gradient: 'from-amber-600 via-orange-500 to-amber-700' },
    { rank: 4,  masked: '@cyber_wolf04',  initial: 'CW', points: 34500, wins: 19, entries: 330, change: -2,  badge: 'Gold Striker',    streak: '✨ 19 Wins',      gradient: 'from-violet-500 to-purple-600' },
    { rank: 5,  masked: '@sol_raider22',  initial: 'SR', points: 31200, wins: 16, entries: 295, change: +4,  badge: 'Star Hunter',     streak: '✨ 16 Wins',      gradient: 'from-blue-500 to-cyan-500' },
    { rank: 6,  masked: '@ve****62',      initial: 'V4', points: 27900, wins: 14, entries: 260, change: +1,  badge: 'Bronze Seeker',   streak: '⚡ 14 Wins',      gradient: 'from-emerald-500 to-teal-500' },
    { rank: 7,  masked: '@neon_ghost88',  initial: 'NG', points: 24100, wins: 12, entries: 220, change: +6,  badge: 'Active Hunter',   streak: '⚡ 12 Wins',      gradient: 'from-rose-500 to-pink-500' },
    { rank: 8,  masked: '@ve****88',      initial: 'V6', points: 21800, wins: 10, entries: 195, change: -3,  badge: 'Active Hunter',   streak: '🎯 10 Wins',      gradient: 'from-indigo-500 to-violet-500' },
    { rank: 9,  masked: '@ve****19',      initial: 'V5', points: 19400, wins: 9,  entries: 175, change: +2,  badge: 'Challenger',      streak: '🎯 9 Wins',       gradient: 'from-amber-400 to-orange-500' },
    { rank: 10, masked: '@luna_spark',    initial: 'LS', points: 17600, wins: 8,  entries: 160, change: 0,   badge: 'Challenger',      streak: '✨ 8 Wins',       gradient: 'from-cyan-500 to-blue-500' },
  ],
  'All-Time': [
    { rank: 1,  masked: '@genesis_god',   initial: 'GG', points: 185400, wins: 112, entries: 1450, change: +40, badge: 'Immortal Legend', streak: '👑 112 Wins Hall', gradient: 'from-amber-300 via-amber-400 to-yellow-500' },
    { rank: 2,  masked: '@valkyrie_x',    initial: 'VX', points: 162900, wins: 94,  entries: 1280, change: +18, badge: 'Apex Overlord',   streak: '⚡ 94 Wins Hall',   gradient: 'from-slate-200 via-cyan-100 to-slate-400' },
    { rank: 3,  masked: '@crypto_king91', initial: 'CK', points: 148320, wins: 85,  entries: 1190, change: +25, badge: 'Diamond Warlord', streak: '🎯 85 Wins Hall',   gradient: 'from-amber-600 via-orange-500 to-amber-700' },
    { rank: 4,  masked: '@apex_hunter37', initial: 'AH', points: 126400, wins: 72,  entries: 1040, change: +5,  badge: 'Platinum Hunter', streak: '✨ 72 Wins',        gradient: 'from-violet-500 to-purple-600' },
    { rank: 5,  masked: '@cyber_wolf04',  initial: 'CW', points: 109800, wins: 64,  entries:  920, change: -1,  badge: 'Gold Striker',    streak: '✨ 64 Wins',        gradient: 'from-blue-500 to-cyan-500' },
    { rank: 6,  masked: '@sol_raider22',  initial: 'SR', points:  94200, wins: 56,  entries:  810, change: +8,  badge: 'Star Hunter',     streak: '⚡ 56 Wins',        gradient: 'from-emerald-500 to-teal-500' },
    { rank: 7,  masked: '@ve****62',      initial: 'V4', points:  82500, wins: 48,  entries:  720, change: -4,  badge: 'Bronze Seeker',   streak: '⚡ 48 Wins',        gradient: 'from-rose-500 to-pink-500' },
    { rank: 8,  masked: '@neon_ghost88',  initial: 'NG', points:  73900, wins: 42,  entries:  650, change: +3,  badge: 'Active Hunter',   streak: '🎯 42 Wins',        gradient: 'from-indigo-500 to-violet-500' },
    { rank: 9,  masked: '@ve****88',      initial: 'V6', points:  66400, wins: 38,  entries:  590, change: +1,  badge: 'Active Hunter',   streak: '🎯 38 Wins',        gradient: 'from-amber-400 to-orange-500' },
    { rank: 10, masked: '@luna_spark',    initial: 'LS', points:  59800, wins: 34,  entries:  530, change: -2,  badge: 'Challenger',      streak: '✨ 34 Wins',        gradient: 'from-cyan-500 to-blue-500' },
  ]
};

const CURRENT_USER_MOCK = {
  rank: 128, 
  masked: '@ve****99', 
  points: 2840, 
  nextRankPoints: 4410, 
  nextRank: 10, 
  badge: 'Rising Contender'
};

const PERIOD_TABS = ['Weekly', 'Daily', 'Monthly', 'All-Time'];

/* ─── Avatar circle with subtle shine ─── */
function Avatar({ initial, gradient, size = 'md' }) {
  const sz = size === 'xl' 
    ? 'w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl ring-4' 
    : size === 'lg' 
    ? 'w-13 h-13 sm:w-16 sm:h-16 text-base sm:text-lg ring-3' 
    : size === 'sm' 
    ? 'w-8 h-8 text-xs ring-1' 
    : 'w-10 h-10 text-sm ring-2';

  return (
    <div className={`${sz} rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center font-black text-white shrink-0 shadow-lg ring-white/20 select-none relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/20 pointer-events-none" />
      <span className="relative z-10 drop-shadow-md">{initial}</span>
    </div>
  );
}

/* ─── Change delta badge ─── */
function Delta({ value }) {
  if (value > 0) return (
    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
      <ArrowUp className="w-2.5 h-2.5" />+{value}
    </span>
  );
  if (value < 0) return (
    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/15 text-rose-400 border border-rose-500/30">
      <ArrowDown className="w-2.5 h-2.5" />{value}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-slate-400 border border-white/10">
      <Minus className="w-2.5 h-2.5" />0
    </span>
  );
}

/* ─── Grand Champions Podium Card ─── */
function PodiumCard({ user, position, onCelebrate }) {
  const isFirst = position === 1;
  const isSecond = position === 2;
  const isThird = position === 3;

  const config = {
    1: {
      order: 'order-1 sm:order-2',
      colHeight: 'h-44 sm:h-52',
      avatarSize: 'xl',
      title: 'GRAND CHAMPION',
      rankTag: '1st',
      glowColor: 'shadow-[0_0_50px_rgba(245,158,11,0.45)]',
      border: 'border-amber-400/60',
      pillBorder: 'border-amber-400/40 bg-amber-500/15 text-amber-300',
      pedestalBg: 'bg-gradient-to-b from-amber-500/25 via-[#1a1209]/90 to-[#0e0a15]/95',
      pedestalRim: 'border-t-2 border-amber-400 shadow-[0_-2px_15px_rgba(245,158,11,0.5)]',
      numColor: 'text-amber-400/25 group-hover:text-amber-400/40',
      labelBg: 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950',
      aura: 'from-amber-500/20 via-yellow-500/10 to-transparent',
      trophyIcon: Trophy,
      iconColor: 'text-amber-400'
    },
    2: {
      order: 'order-2 sm:order-1',
      colHeight: 'h-32 sm:h-40',
      avatarSize: 'lg',
      title: 'RUNNER UP',
      rankTag: '2nd',
      glowColor: 'shadow-[0_0_40px_rgba(148,163,184,0.3)]',
      border: 'border-slate-300/50',
      pillBorder: 'border-slate-300/30 bg-slate-400/15 text-slate-200',
      pedestalBg: 'bg-gradient-to-b from-slate-300/20 via-[#14151e]/90 to-[#0e0a15]/95',
      pedestalRim: 'border-t-2 border-slate-300 shadow-[0_-2px_12px_rgba(203,213,225,0.4)]',
      numColor: 'text-slate-300/25 group-hover:text-slate-300/40',
      labelBg: 'bg-gradient-to-r from-slate-200 via-slate-300 to-cyan-200 text-slate-950',
      aura: 'from-slate-400/15 via-cyan-400/10 to-transparent',
      trophyIcon: Medal,
      iconColor: 'text-slate-200'
    },
    3: {
      order: 'order-3 sm:order-3',
      colHeight: 'h-24 sm:h-32',
      avatarSize: 'lg',
      title: 'CONTENDER',
      rankTag: '3rd',
      glowColor: 'shadow-[0_0_40px_rgba(217,119,6,0.3)]',
      border: 'border-amber-700/50',
      pillBorder: 'border-amber-600/30 bg-amber-700/15 text-amber-400',
      pedestalBg: 'bg-gradient-to-b from-amber-700/20 via-[#17100e]/90 to-[#0e0a15]/95',
      pedestalRim: 'border-t-2 border-amber-600 shadow-[0_-2px_12px_rgba(217,119,6,0.4)]',
      numColor: 'text-amber-600/25 group-hover:text-amber-600/40',
      labelBg: 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white',
      aura: 'from-amber-700/15 via-orange-600/10 to-transparent',
      trophyIcon: Award,
      iconColor: 'text-amber-500'
    }
  };

  const c = config[position];
  const TrophyIcon = c.trophyIcon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: position * 0.07, ease: [0.23, 1, 0.32, 1] }}
      className={`group flex flex-col items-center ${c.order} w-full relative z-10`}
    >
      {/* Background Light Beam Behind Champion */}
      <div className={`absolute -top-12 inset-x-0 h-44 bg-gradient-to-b ${c.aura} blur-2xl pointer-events-none rounded-full`} />

      {/* Floating Crown or Medal above Champion */}
      <div className="h-10 flex items-center justify-center mb-1 relative">
        {isFirst && (
          <motion.button
            type="button"
            onClick={onCelebrate}
            title="Click to celebrate #1 Champion!"
            animate={{ y: [0, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
            className="cursor-pointer group/crown relative flex items-center justify-center p-1"
          >
            <div className="absolute inset-0 bg-amber-400/30 blur-md rounded-full group-hover/crown:scale-150 transition-transform" />
            <Crown className="w-8 h-8 text-amber-300 fill-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)] relative z-10" />
            <Sparkles className="w-3.5 h-3.5 text-yellow-200 absolute -top-1 -right-2 animate-spin duration-1000" />
          </motion.button>
        )}

        {isSecond && (
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-slate-300 flex items-center justify-center"
          >
            <Medal className="w-6 h-6 drop-shadow-[0_0_10px_rgba(203,213,225,0.6)]" />
          </motion.div>
        )}

        {isThird && (
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut', delay: 0.4 }}
            className="text-amber-500 flex items-center justify-center"
          >
            <Award className="w-6 h-6 drop-shadow-[0_0_10px_rgba(217,119,6,0.6)]" />
          </motion.div>
        )}
      </div>

      {/* Avatar with Metallic Halo & Glow */}
      <div className="relative mb-3">
        <div className={`rounded-2xl transition-transform duration-300 group-hover:scale-105 ${c.glowColor}`}>
          <Avatar initial={user.initial} gradient={user.gradient} size={c.avatarSize} />
        </div>

        {/* Position rank badge anchored to bottom right */}
        <span className={`absolute -bottom-2 -right-1.5 px-2 py-0.5 rounded-full ${c.labelBg} text-[10px] sm:text-xs font-black shadow-xl tracking-wider flex items-center gap-0.5 ring-2 ring-[#0c0817]`}>
          <TrophyIcon className="w-3 h-3" />
          {c.rankTag}
        </span>
      </div>

      {/* User Info & Points Card */}
      <div className="w-full text-center px-2 py-2.5 mb-2 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/5 group-hover:border-white/10 transition-colors">
        <p className="text-xs sm:text-sm font-bold text-white font-mono truncate tracking-tight">
          {user.masked}
        </p>

        {/* Dynamic Streak Badge */}
        <span className="inline-block text-[9px] sm:text-[10px] font-semibold text-purple-300/90 mt-0.5">
          {user.streak || user.badge}
        </span>

        {/* Glowing Points Counter */}
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <Coins className={`w-3.5 h-3.5 ${c.iconColor}`} />
          <span className="text-base sm:text-xl font-black text-white tracking-tight font-mono">
            {user.points.toLocaleString()}
          </span>
          <span className="text-[10px] text-purple-400 font-extrabold uppercase">VEs</span>
        </div>

        <div className="mt-1.5 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
          <span>{user.wins}W</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>{user.entries}E</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <Delta value={user.change} />
        </div>
      </div>

      {/* 3D Cyber Pedestal Base */}
      <div 
        className={`w-full rounded-t-2xl sm:rounded-t-3xl border border-b-0 ${c.border} ${c.pedestalBg} ${c.pedestalRim} ${c.colHeight} flex flex-col items-center justify-between p-3 relative overflow-hidden backdrop-blur-xl transition-all duration-300 group-hover:brightness-110`}
      >
        {/* Subtle Cyber Grid Lines inside Pedestal */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100%_12px] opacity-20 pointer-events-none" />

        {/* Podium Subtitle */}
        <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${c.pillBorder} shadow-sm z-10`}>
          {c.title}
        </span>

        {/* Giant Embossed Number */}
        <span className={`text-5xl sm:text-7xl font-black ${c.numColor} transition-colors select-none font-mono tracking-tighter leading-none z-0 my-auto drop-shadow-md`}>
          {position}
        </span>

        {/* Rank Label Bottom */}
        <div className="z-10 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400/70" />
          Rank #{position}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Leaderboard Component ─── */
export default function Leaderboard() {
  const { currentUser } = useGiveaway();
  const [period, setPeriod] = useState('Weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [resetCountdown, setResetCountdown] = useState('05h 28m 14s');

  // Real-time ticking countdown to give live gaming hype
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const hoursLeft = 23 - now.getHours();
      const minutesLeft = 59 - now.getMinutes();
      const secondsLeft = 59 - now.getSeconds();

      const pad = (n) => String(n).padStart(2, '0');
      if (period === 'Daily') {
        setResetCountdown(`${pad(hoursLeft)}h ${pad(minutesLeft)}m ${pad(secondsLeft)}s`);
      } else if (period === 'Weekly') {
        const daysLeft = 6 - now.getDay();
        setResetCountdown(`${daysLeft}d ${pad(hoursLeft)}h ${pad(minutesLeft)}m`);
      } else if (period === 'Monthly') {
        setResetCountdown(`18d ${pad(hoursLeft)}h ${pad(minutesLeft)}m`);
      } else {
        setResetCountdown('Season 4 Active');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [period]);

  // Confetti celebration trigger
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#FBBF24', '#7C3AED', '#38BDF8', '#FFFFFF']
      });
    } catch {
      // Graceful fallback
    }
  };

  // Get active dataset based on selected period
  const activeData = useMemo(() => {
    return LEADERBOARD_PERIOD_DATA[period] || LEADERBOARD_PERIOD_DATA['Weekly'];
  }, [period]);

  const top3 = useMemo(() => activeData.slice(0, 3), [activeData]);
  const rest = useMemo(() => activeData.slice(3), [activeData]);

  // Filtered rows for table
  const filteredRest = useMemo(() => {
    if (!searchQuery.trim()) return rest;
    const q = searchQuery.toLowerCase();
    return rest.filter((u) => 
      u.masked.toLowerCase().includes(q) || 
      u.badge.toLowerCase().includes(q)
    );
  }, [rest, searchQuery]);

  const displayedRest = showAll ? filteredRest : filteredRest.slice(0, 4);

  const me = CURRENT_USER_MOCK;
  const progressPct = Math.min(100, Math.round((me.points / me.nextRankPoints) * 100));

  const PERKS = [
    { icon: Trophy,    label: 'Grand Champion NFT',   desc: 'Exclusive on-chain gold verifiable badge', color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20' },
    { icon: Zap,       label: '+1,500 Bonus VEs',       desc: 'Weekly instant boost for Top 10 hunters',  color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/20' },
    { icon: ShieldCheck, label: 'VIP Priority Queuing', desc: 'Instant verification on all rewards',    color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { icon: Gift,      label: 'Secret Mystery Drop',    desc: 'Guaranteed high-tier physical loot boxes',color: 'text-pink-400',    bg: 'bg-pink-500/10 border-pink-500/20' },
  ];

  return (
    <section className="w-full space-y-7 relative">

      {/* ── Top Header Bar ── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 p-5 sm:p-6 rounded-3xl bg-[#0d0a1a]/80 border border-purple-500/20 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.35)] relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-purple-600/10 blur-3xl pointer-events-none" />

        {/* Title & Live Status */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 via-purple-500/20 to-indigo-600/20 border border-amber-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <Trophy className="w-6 h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-[#0d0a1a]" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                🏆 Leaderboard
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-2">
              <span>Top reward hunters ranked by VEs earned</span>
              <span className="text-slate-600">•</span>
              <span className="text-purple-400 font-semibold">Season 4 Active</span>
            </p>
          </div>
        </div>

        {/* Right Controls: Reset Countdown + Period Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Countdown pill */}
          <div className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-semibold backdrop-blur-md shadow-inner">
            <Clock className="w-3.5 h-3.5 text-purple-400 animate-spin duration-1000" />
            <span className="text-slate-400 text-[11px]">Resets in:</span>
            <span className="text-purple-300 font-mono font-bold tracking-tight">{resetCountdown}</span>
          </div>

          {/* Period selector tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-[#090614] border border-white/10 shadow-inner">
            {PERIOD_TABS.map((tab) => {
              const active = period === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setPeriod(tab)}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer select-none ${
                    active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activePeriodHighlight"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#a855f7] shadow-[0_0_18px_rgba(124,58,237,0.6)]"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Season Prize Pool & Hype Strip ── */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-600/15 to-blue-500/15 border border-amber-500/25 p-3.5 sm:p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_30px_rgba(245,158,11,0.12)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shrink-0">
            <Gift className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>🎁 Season {period} Reward Pool:</span>
              <span className="text-amber-300 font-extrabold font-mono">250,000 VEs + 3 Rare Crates</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Top 3 Champions receive guaranteed physical and on-chain loot drops</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[11px] font-semibold text-purple-300 bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
            3,842 Hunters Competing
          </span>
        </div>
      </div>

      {/* ── Top 3 Champions Arena Podium ── */}
      <div className="rounded-3xl bg-gradient-to-b from-[#110c26]/95 via-[#0a0717]/95 to-[#06040f]/98 border border-purple-500/25 p-4 sm:p-8 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        
        {/* Cyber Background Glow Elements */}
        <div className="absolute top-0 inset-x-0 h-40 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(124,58,237,0.25)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />

        {/* Podium Sub-header */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 relative z-10 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl">🎖️</span>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide uppercase">
                Top 3 Champions — {period}
              </h3>
              <p className="text-[11px] text-slate-400">Current tier masters holding the podium positions</p>
            </div>
          </div>

          <button
            onClick={triggerCelebration}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin duration-1000" />
            <span className="hidden sm:inline">Celebrate</span> 🏆
          </button>
        </div>

        {/* 3D Staged Podium: 2nd Place | 1st Place (Elevated) | 3rd Place */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 items-end max-w-2xl mx-auto pt-4 sm:pt-6 relative z-10">
          <AnimatePresence mode="wait">
            <PodiumCard 
              key={`podium-2-${period}-${top3[1]?.masked}`} 
              user={top3[1]} 
              position={2} 
              onCelebrate={triggerCelebration} 
            />
            <PodiumCard 
              key={`podium-1-${period}-${top3[0]?.masked}`} 
              user={top3[0]} 
              position={1} 
              onCelebrate={triggerCelebration} 
            />
            <PodiumCard 
              key={`podium-3-${period}-${top3[2]?.masked}`} 
              user={top3[2]} 
              position={3} 
              onCelebrate={triggerCelebration} 
            />
          </AnimatePresence>
        </div>
      </div>

      {/* ── Ranks 4–10 Pro League Table ── */}
      <div className="rounded-3xl bg-[#0a0717]/85 backdrop-blur-2xl border border-white/10 overflow-hidden shadow-xl">
        
        {/* Table Controls & Search */}
        <div className="p-4 sm:p-5 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/[0.02]">
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-purple-400" />
              Contender Tier Leaderboard (Rank 4 – 10)
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Real-time point shifts & hunter performance</p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search hunter or tier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Table Header Row */}
        <div className="hidden sm:grid grid-cols-[60px_1fr_120px_110px_70px] px-5 py-3 border-b border-white/5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 bg-white/[0.01]">
          <span>Rank</span>
          <span>Hunter & Tier</span>
          <span className="text-center">Performance</span>
          <span className="text-right">VEs Earned</span>
          <span className="text-right">Trend</span>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-white/5">
          <AnimatePresence>
            {displayedRest.map((user, idx) => {
              const isTop5 = user.rank <= 5;

              return (
                <motion.div
                  key={`${period}-${user.rank}-${user.masked}`}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  className="group px-4 sm:px-5 py-3.5 flex flex-col sm:grid sm:grid-cols-[60px_1fr_120px_110px_70px] gap-3 sm:gap-2 items-start sm:items-center hover:bg-purple-600/[0.08] transition-colors relative"
                >
                  {/* Left accent hover glow */}
                  <div className="absolute left-0 inset-y-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Rank Column */}
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black font-mono transition-transform group-hover:scale-110 ${
                      isTop5 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.25)]' 
                        : 'bg-white/5 text-slate-400 border border-white/10'
                    }`}>
                      #{user.rank}
                    </div>
                  </div>

                  {/* User & Avatar Info */}
                  <div className="flex items-center gap-3 min-w-0 w-full">
                    <Avatar initial={user.initial} gradient={user.gradient} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-white font-mono truncate group-hover:text-purple-300 transition-colors">
                        {user.masked}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                          {user.badge}
                        </span>
                        <span className="text-[10px] text-purple-400/80 font-medium">
                          {user.streak}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats (Performance) */}
                  <div className="flex sm:justify-center items-center gap-2 text-xs font-semibold text-slate-400">
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-[11px] text-slate-300">
                      🏆 {user.wins} Wins
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[11px] text-slate-400">
                      {user.entries} Entries
                    </span>
                  </div>

                  {/* VEs Earned Column */}
                  <div className="flex sm:justify-end items-center gap-1.5 text-right w-full sm:w-auto">
                    <Coins className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-sm sm:text-base font-black text-purple-300 font-mono tracking-tight">
                      {user.points.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">VEs</span>
                  </div>

                  {/* Trend Delta */}
                  <div className="flex sm:justify-end items-center">
                    <Delta value={user.change} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Show More / Show Less Toggle */}
        {filteredRest.length > 4 && (
          <div className="p-3.5 border-t border-white/5 flex justify-center bg-white/[0.01]">
            <button
              onClick={() => setShowAll((p) => !p)}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border border-purple-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              {showAll ? 'Collapse to Top 6' : `Show all rankings (${filteredRest.length} hunters)`}
              {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* ── Current User VIP Standing HUD Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-purple-900/30 via-[#0e0a1f] to-indigo-900/30 border border-purple-500/40 p-5 sm:p-6 shadow-[0_10px_35px_rgba(124,58,237,0.2)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-32 bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#7C3AED] flex items-center justify-center text-white font-black text-base shadow-[0_0_20px_rgba(124,58,237,0.5)] ring-2 ring-purple-400/40">
                {currentUser ? currentUser.customUserId?.slice(-2).toUpperCase() || 'ME' : 'ME'}
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-purple-600 text-[9px] font-black text-white uppercase tracking-wider shadow">
                YOU
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-extrabold text-white">Your Leaderboard Standing</p>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-500/25 border border-purple-500/40 text-purple-200">
                  Rank #{me.rank}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {currentUser?.customUserId ? `@${currentUser.customUserId}` : me.masked} • <span className="text-purple-300 font-semibold">{me.badge}</span>
              </p>
            </div>
          </div>

          {/* Progress bar towards Top 10 */}
          <div className="flex-1 w-full lg:max-w-md">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-bold">{me.points.toLocaleString()} VEs Earned</span>
              <span className="text-purple-400 font-bold">Target Rank #{me.nextRank}: {me.nextRankPoints.toLocaleString()} VEs</span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/10 p-0.5 overflow-hidden ring-1 ring-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-[#6366F1] via-[#a855f7] to-[#ec4899] shadow-[0_0_12px_rgba(168,85,247,0.8)]"
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[11px]">
              <span className="text-slate-400 font-medium">{progressPct}% of Top 10 Entry</span>
              <span className="text-emerald-400 font-semibold">Needs +{(me.nextRankPoints - me.points).toLocaleString()} VEs to break Top 10!</span>
            </div>
          </div>

          {/* Quick CTA Action */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <a
              href="#active-giveaways"
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold text-center shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              Boost My Rank Now
            </a>
          </div>
        </div>
      </motion.div>

      {/* ── Leaderboard Season Perks ── */}
      <div className="rounded-3xl bg-[#0a0717]/80 border border-white/10 p-5 sm:p-6 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between gap-3 mb-5">
          <p className="text-xs sm:text-sm font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Season 4 Exclusive Performer Perks
          </p>
          <span className="text-[11px] font-semibold text-purple-400">Awarded Weekly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {PERKS.map(({ icon: Icon, label, desc, color, bg }) => (
            <div
              key={label}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border ${bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">{label}</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
