import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { useGiveaway } from '../../context/GiveawayContext';
import api from '../../services/api';

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

export default function LiveWinnersTicker() {
  const { giveaways } = useGiveaway();
  const [realWinners, setRealWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real winners strictly from backend API (Rule 21 & 63: No fake live activity)
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await api.fetchAllWinners();
        if (isMounted && Array.isArray(res) && res.length > 0) {
          setRealWinners(res);
        } else {
          // Fallback from giveaways context concluded items
          const fromCtx = (giveaways || [])
            .filter((g) => g.status === 'ENDED' && g.winners?.length > 0)
            .flatMap((g) =>
              g.winners.map((w) => {
                const rawId = w.customUserId || w.userId || '';
                const masked = w.maskedUserId || (rawId ? `${rawId.slice(0, 2)}****${rawId.slice(-2)}` : 'VE****00');
                return {
                  id: w._id || w.id,
                  maskedUserId: masked,
                  prize: w.prizeName || w.prizeTitle || g.title,
                  drawTimestamp: w.drawTimestamp
                };
              })
            );
          if (isMounted) setRealWinners(fromCtx);
        }
      } catch {
        const fromCtx = (giveaways || [])
          .filter((g) => g.status === 'ENDED' && g.winners?.length > 0)
          .flatMap((g) =>
            g.winners.map((w) => {
              const rawId = w.customUserId || w.userId || '';
              const masked = w.maskedUserId || (rawId ? `${rawId.slice(0, 2)}****${rawId.slice(-2)}` : 'VE****00');
              return {
                id: w._id || w.id,
                maskedUserId: masked,
                prize: w.prizeName || w.prizeTitle || g.title,
                drawTimestamp: w.drawTimestamp
              };
            })
          );
        if (isMounted) setRealWinners(fromCtx);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [giveaways]);

  // Requirement 1: If winners list is empty, display live platform status update
  if (!loading && realWinners.length === 0) {
    const liveUpdateText = "Season 1 Giveaways are now LIVE • No winners declared yet • Verified winners will appear here automatically upon draw completion!";
    const duplicatedNotice = [1, 2, 3, 4];

    return (
      <div className="w-full bg-[#110e1f]/90 border-y border-purple-500/20 py-2.5 overflow-hidden flex items-center mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md">
        {/* Fixed Left Status Badge */}
        <div className="px-3.5 sm:px-4 shrink-0 flex items-center gap-2 border-r border-white/10 text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider z-10 bg-[#110e1f]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-emerald-400 font-extrabold font-mono flex items-center gap-1">
            PLATFORM UPDATE:
          </span>
        </div>

        {/* Continuous Smooth Scrolling Marquee */}
        <div className="flex overflow-hidden w-full select-none relative">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, repeatType: 'loop', duration: 28, ease: 'linear' }}
            className="flex items-center gap-8 whitespace-nowrap pl-4"
          >
            {duplicatedNotice.map((idx) => (
              <span key={idx} className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <span className="text-white font-semibold">{liveUpdateText}</span>
                <span className="text-purple-400 font-bold">•</span>
                <a
                  href="#active-giveaways"
                  className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2 flex items-center gap-1"
                >
                  Explore Pools <ArrowRight className="w-3 h-3" />
                </a>
                <span className="text-slate-600">|</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  if (realWinners.length === 0) {
    return null;
  }

  // Duplicate items for continuous smooth ticker loop when real winners exist
  const displayItems = realWinners.map((w) => ({
    user: w.maskedUserId || 'VE****00',
    prize: w.prize || w.prizeName || 'Verified Reward',
    time: formatTimeAgo(w.drawTimestamp)
  }));

  const items = [...displayItems, ...displayItems, ...displayItems, ...displayItems];

  return (
    <div className="w-full bg-[#13131a] border-y border-white/5 py-2 overflow-hidden flex items-center gap-0 mb-6 shadow-sm">
      {/* Label */}
      <div className="px-3.5 shrink-0 flex items-center gap-1.5 border-r border-white/10 text-[11px] font-bold text-amber-400 font-mono uppercase tracking-wider bg-[#13131a] z-10">
        <Trophy className="w-3.5 h-3.5 text-amber-400" />
        Audited Winners:
      </div>

      {/* Scrolling strip */}
      <div className="flex overflow-hidden w-full select-none">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, repeatType: 'loop', duration: 25, ease: 'linear' }}
          className="flex items-center gap-6 whitespace-nowrap pl-4"
        >
          {items.map((w, i) => (
            <span key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                {w.user}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 font-mono">{w.time}</span>
              <span className="text-slate-500">won</span>
              <strong className="text-white font-medium">{w.prize}</strong>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
