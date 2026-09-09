import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Megaphone, Trophy, Pause, Play, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGiveaway } from '../../context/GiveawayContext';
import api from '../../services/api';

const AVATAR_GRADIENTS = [
  'from-purple-500 to-violet-700',
  'from-cyan-400 to-blue-600',
  'from-amber-400 to-orange-500',
  'from-rose-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-700',
];

function formatTimeAgo(timestamp) {
  if (!timestamp) return 'Recently';
  try {
    const past = new Date(timestamp).getTime();
    if (isNaN(past)) return String(timestamp);
    const now = Date.now();
    const diffSec = Math.floor((now - past) / 1000);

    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
  } catch {
    return 'Recently';
  }
}

// Dynamic Name Initials Generator
function getInitials(name, fallback = 'VE') {
  if (!name || typeof name !== 'string') return fallback;
  const trimmed = name.trim();
  if (!trimmed) return fallback;
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (trimmed.length >= 2) {
    return trimmed.slice(0, 2).toUpperCase();
  }
  return trimmed.toUpperCase();
}

// Strictly resolve icons ONLY for approved platform prizes
function resolvePrizeIcon(prizeName = '') {
  const p = (prizeName || '').toLowerCase();
  if (p.includes('iphone')) return '📱';
  if (p.includes('watch')) return '⌚';
  if (p.includes('airpods')) return '🎧';
  if (p.includes('amazon') || p.includes('voucher') || p.includes('gift card')) return '🎁';
  if (p.includes('20') || p.includes('token') || p.includes('recharge')) return '⚡';
  return '🎁';
}

export default function WinnersList() {
  const { giveaways } = useGiveaway();
  const [dbWinners, setDbWinners] = useState([]);
  const [_isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch real winners strictly from MongoDB backend API (Zero mock data in live state)
  useEffect(() => {
    let isMounted = true;
    async function loadRealWinners() {
      setIsLoading(true);
      try {
        const res = await api.fetchAllWinners();
        if (isMounted) {
          if (Array.isArray(res) && res.length > 0) {
            setDbWinners(res);
          } else {
            // Fallback check from giveaways context concluded items
            const fromContext = (giveaways || [])
              .filter((g) => g.status === 'ENDED' && g.winners?.length > 0)
              .flatMap((g) =>
                g.winners.map((w, idx) => {
                  const rawId = w.customUserId || w.userId || '';
                  const masked = w.maskedUserId || (rawId ? `${rawId.slice(0, 2)}****${rawId.slice(-2)}` : 'VE****00');
                  return {
                    id: w._id || w.id || `ctx-${idx}`,
                    maskedUserId: masked,
                    name: masked,
                    prize: w.prizeName || w.prizeTitle || g.title,
                    prizeName: w.prizeName || g.title,
                    prizeType: w.prizeType || 'PHYSICAL',
                    drawTimestamp: w.drawTimestamp,
                    ticketNumber: w.ticketNumber
                  };
                })
              );
            setDbWinners(fromContext);
          }
        }
      } catch (err) {
        console.warn('[WinnersList] Error fetching backend winners:', err.message);
        const fromContext = (giveaways || [])
          .filter((g) => g.status === 'ENDED' && g.winners?.length > 0)
          .flatMap((g) =>
            g.winners.map((w, idx) => {
              const rawId = w.customUserId || w.userId || '';
              const masked = w.maskedUserId || (rawId ? `${rawId.slice(0, 2)}****${rawId.slice(-2)}` : 'VE****00');
              return {
                id: w._id || w.id || `ctx-${idx}`,
                maskedUserId: masked,
                name: masked,
                prize: w.prizeName || w.prizeTitle || g.title,
                prizeName: w.prizeName || g.title,
                prizeType: w.prizeType || 'PHYSICAL',
                drawTimestamp: w.drawTimestamp,
                ticketNumber: w.ticketNumber
              };
            })
          );
        if (isMounted) setDbWinners(fromContext);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadRealWinners();
    return () => { isMounted = false; };
  }, [giveaways]);

  // Transform winners adhering strictly to privacy standards (e.g. VE****42)
  const pool = dbWinners.map((w, idx) => {
    const masked = w.maskedUserId || w.name || 'VE****00';
    return {
      id: w.id || w._id || `winner-${idx}`,
      name: masked,
      prize: w.prize || w.prizeName || 'Verified Reward',
      time: w.time || formatTimeAgo(w.drawTimestamp),
      initials: getInitials(w.actualName || w.userName || w.name, 'VE'),
      prize_icon: resolvePrizeIcon(w.prize || w.prizeName),
      ticketNumber: w.ticketNumber
    };
  });

  // Auto-refreshing cycling mechanism every 3.5 seconds when winners exist
  useEffect(() => {
    if (isPaused || pool.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pool.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, pool.length]);

  // Window of visible winners (up to 4)
  const visibleCount = Math.min(pool.length, 4);
  const visibleWinners = [];
  if (pool.length > 0) {
    for (let i = 0; i < visibleCount; i++) {
      const item = pool[(currentIndex + i) % pool.length];
      visibleWinners.push({
        ...item,
        displayKey: `${item.id}-${currentIndex + i}`,
        isRecentAddition: i === 0,
      });
    }
  }

  return (
    <section className="w-full space-y-5">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-none">Winner Announcements</h2>
            <p className="text-xs text-slate-400 mt-1">Official verified winners from concluded giveaways</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {pool.length > 1 && (
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-[#13131a] border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          )}

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

      {/* ── Conditional Rendering: Empty State vs Real Data-Driven Winners Grid ── */}
      {pool.length === 0 ? (
        /* Requirement 2: Clean, High-End Empty State Card */
        <div className="w-full rounded-3xl bg-[#100d1e]/90 border border-purple-500/20 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-[0_10px_35px_rgba(0,0,0,0.4)] relative overflow-hidden backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)] mb-1">
            <Trophy className="w-8 h-8 text-purple-400/90 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          </div>

          <div className="max-w-md space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/15 border border-purple-500/30 text-purple-300">
              Season 1 In Progress
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              No Winners Declared Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              No winners have been declared yet for Season 1. Once a giveaway event concludes and the verified cryptographic draw completes, official winners will appear here automatically.
            </p>
          </div>

          <a
            href="#active-giveaways"
            className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#a855f7] hover:opacity-95 shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_28px_rgba(124,58,237,0.6)] transition-all cursor-pointer active:scale-95"
          >
            <span>Explore Active Giveaways</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      ) : (
        /* Real Data-Driven Winners Grid with Framer Motion */
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
                    flex items-center justify-center shrink-0 text-white text-xs font-bold font-mono shadow-lg overflow-visible`}
                >
                  {w.initials}
                  {/* Trophy/Prize badge */}
                  <span className="absolute -bottom-1 -right-1 text-base leading-none select-none drop-shadow-md">
                    {w.prize_icon || '🏆'}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 relative">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white font-mono leading-snug truncate group-hover:text-purple-300 transition-colors">
                      {w.name}
                    </p>
                    {w.isRecentAddition && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse">
                        <Sparkles className="w-2.5 h-2.5" /> VERIFIED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    Won <span className="text-slate-200 font-medium">{w.prize}</span>
                  </p>
                  {w.ticketNumber && (
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                      Ticket: {w.ticketNumber}
                    </p>
                  )}
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
      )}
    </section>
  );
}
