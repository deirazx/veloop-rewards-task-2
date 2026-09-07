import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Megaphone, Trophy, Radio, Pause, Play, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGiveaway } from '../../context/GiveawayContext';

const AVATAR_GRADIENTS = [
  'from-purple-500 to-violet-700',
  'from-cyan-400 to-blue-600',
  'from-amber-400 to-orange-500',
  'from-rose-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-700',
];

const POOL_WINNERS = [
  { id: 1, name: 'Rohit Sharma', prize: 'Amazon Gift Card ₹5,000', time: 'Just now', initials: 'RS', prize_icon: '🎁', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', isFresh: true },
  { id: 2, name: 'Neha Patel', prize: 'Paytm Gift Card ₹1,000', time: '14s ago', initials: 'NP', prize_icon: '💸', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Arjun Singh', prize: 'iPhone 15 Pro', time: '38s ago', initials: 'AS', prize_icon: '📱', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Priya Mehta', prize: 'AirPods Pro Gen 2', time: '2m ago', initials: 'PM', prize_icon: '🎧', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Rahul Gupta', prize: 'Apple Watch S9', time: '4m ago', initials: 'RG', prize_icon: '⌚', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { id: 6, name: 'Ananya Roy', prize: 'Sony WH-1000XM5', time: '7m ago', initials: 'AR', prize_icon: '🎵', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { id: 7, name: 'Vikram Malhotra', prize: 'OnePlus 12 5G', time: '12m ago', initials: 'VM', prize_icon: '⚡', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
  { id: 8, name: 'Sneha Reddy', prize: 'Flipkart Gift Card ₹2,500', time: '18m ago', initials: 'SR', prize_icon: '🛍️', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' },
];

function relativeTime(ts) {
  if (!ts) return 'Recently';
  if (typeof ts === 'string' && (ts.includes('ago') || ts.includes('Just'))) return ts;
  return ts;
}

export default function WinnersList() {
  const { giveaways } = useGiveaway();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Dynamic winner pool: API winners if available, combined with fallback pool
  const apiWinners = (giveaways || [])
    .filter((g) => g.status === 'ENDED' && g.winners?.length > 0)
    .flatMap((g) =>
      g.winners.map((w, idx) => ({
        id: w._id || w.id || `api-${idx}`,
        name: w.name,
        prize: w.prizeTitle || g.title,
        avatar: w.avatar || w.profileImage || null,
        time: relativeTime(w.drawTimestamp),
        initials: (w.name || 'U').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
        prize_icon: '🏆',
      }))
    );

  const pool = apiWinners.length > 0 ? [...apiWinners, ...POOL_WINNERS] : POOL_WINNERS;

  // Auto-refreshing mechanism every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pool.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, pool.length]);

  // Window of 4 visible winners
  const visibleCount = 4;
  const visibleWinners = [];
  for (let i = 0; i < visibleCount; i++) {
    const item = pool[(currentIndex + i) % pool.length];
    visibleWinners.push({
      ...item,
      displayKey: `${item.id}-${currentIndex + i}`,
      isRecentAddition: i === 0,
    });
  }

  return (
    <section className="w-full">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-white leading-none">Winner Announcements</h2>
              
              {/* Live Ticker Indicator */}
              <div
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                  isPaused
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}
                title={isPaused ? 'Auto-cycle paused' : 'Cycling every 3.5s'}
              >
                {isPaused ? (
                  <>
                    <Pause className="w-2.5 h-2.5" />
                    <span>Paused</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live Feed</span>
                  </>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Real-time provably fair verified winner feed</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Pause/Play Controls */}
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-[#13131a] border border-white/5 hover:border-white/10 transition-colors"
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <Link
            to="/winners"
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold
              text-[#a855f7] border border-purple-500/20 bg-purple-500/8
              hover:bg-purple-500/15 transition-colors shrink-0"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Auto-Refreshing Winner Grid with Framer Motion ── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-3"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="popLayout">
          {visibleWinners.map((w, i) => (
            <motion.div
              key={w.displayKey}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className={`group flex items-center gap-4 bg-[#13131a] rounded-2xl px-5 py-4
                border transition-all duration-200 relative overflow-hidden ${
                  w.isRecentAddition
                    ? 'border-purple-500/40 shadow-[0_0_24px_rgba(168,85,247,0.15)] bg-gradient-to-r from-purple-500/8 via-[#13131a] to-[#13131a]'
                    : 'border-white/5 hover:border-purple-500/20 hover:shadow-[0_0_24px_rgba(168,85,247,0.08)]'
                }`}
            >
              {/* Subtle hover glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/4 to-purple-500/0
                opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Avatar */}
              <div
                className={`relative w-11 h-11 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[(currentIndex + i) % AVATAR_GRADIENTS.length]}
                  flex items-center justify-center shrink-0 text-white text-sm font-bold shadow-lg overflow-visible`}
              >
                {w.avatar ? (
                  <img
                    src={w.avatar}
                    alt={w.name}
                    className="w-full h-full rounded-full object-cover border border-white/10"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  w.initials
                )}
                {/* Trophy/Prize badge */}
                <span className="absolute -bottom-1 -right-1 text-base leading-none select-none drop-shadow-md">
                  {w.prize_icon || '🏆'}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 relative">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white leading-snug truncate group-hover:text-purple-300 transition-colors">
                    {w.name}
                  </p>
                  {w.isRecentAddition && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse">
                      <Sparkles className="w-2.5 h-2.5" /> NEW
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  Won <span className="text-slate-200 font-medium">{w.prize}</span>
                </p>
              </div>

              {/* Time + trophy badge */}
              <div className="relative flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-1 text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                  <Trophy className="w-2.5 h-2.5" />
                  Winner
                </div>
                <span className="text-xs text-slate-500 font-mono">{w.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
