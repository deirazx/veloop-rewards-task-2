import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
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

  // Fetch real winners strictly from backend API (Rule 21 & 63: No fake live activity!)
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
              g.winners.map((w) => ({
                id: w._id || w.id,
                maskedUserId: w.maskedUserId || 'VE****25',
                prize: w.prizeName || w.prizeTitle || g.title,
                drawTimestamp: w.drawTimestamp
              }))
            );
          if (isMounted) setRealWinners(fromCtx);
        }
      } catch {
        const fromCtx = (giveaways || [])
          .filter((g) => g.status === 'ENDED' && g.winners?.length > 0)
          .flatMap((g) =>
            g.winners.map((w) => ({
              id: w._id || w.id,
              maskedUserId: w.maskedUserId || 'VE****25',
              prize: w.prizeName || w.prizeTitle || g.title,
              drawTimestamp: w.drawTimestamp
            }))
          );
        if (isMounted) setRealWinners(fromCtx);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [giveaways]);

  // If no winners exist in database: Display exact premium empty state bar (Rule 21 & 64)
  if (!loading && realWinners.length === 0) {
    return (
      <div className="w-full bg-[#13131a] border-y border-white/5 py-2.5 px-4 mb-6 flex items-center justify-center gap-2 text-xs text-gray-400">
        <Trophy className="w-3.5 h-3.5 text-slate-500/70" />
        <span>Previous winners will appear here after a giveaway is completed.</span>
      </div>
    );
  }

  if (realWinners.length === 0) {
    return null;
  }

  // Duplicate items for continuous smooth ticker loop
  const displayItems = realWinners.map((w) => ({
    user: w.maskedUserId || 'VE****00',
    prize: w.prize || w.prizeName || 'Verified Reward',
    time: formatTimeAgo(w.drawTimestamp)
  }));

  const items = [...displayItems, ...displayItems, ...displayItems, ...displayItems];

  return (
    <div className="w-full bg-[#13131a] border-y border-white/5 py-2 overflow-hidden flex items-center gap-0 mb-6">
      {/* Label */}
      <div className="px-3 shrink-0 flex items-center gap-1.5 border-r border-white/10 text-[11px] font-bold text-amber-400 font-mono uppercase tracking-wider">
        <Trophy className="w-3 h-3 text-amber-400" />
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
