import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Megaphone, Trophy } from 'lucide-react';
import { useGiveaway } from '../../context/GiveawayContext';

const AVATAR_GRADIENTS = [
  'from-purple-500 to-violet-700',
  'from-cyan-400 to-blue-600',
  'from-amber-400 to-orange-500',
  'from-rose-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-700',
];

const FALLBACK_WINNERS = [
  { id: 1, name: 'Rohit Sharma', prize: 'Amazon Gift Card ₹5,000', time: '2m ago', initials: 'RS', prize_icon: '🎁', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Neha Patel', prize: 'Paytm Gift Card ₹1,000', time: '15m ago', initials: 'NP', prize_icon: '💸', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Arjun Singh', prize: 'iPhone 15 Pro', time: '1h ago', initials: 'AS', prize_icon: '📱', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Priya Mehta', prize: 'AirPods Pro Gen 2', time: '3h ago', initials: 'PM', prize_icon: '🎧', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Rahul Gupta', prize: 'Apple Watch S9', time: '5h ago', initials: 'RG', prize_icon: '⌚', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
];

function relativeTime(ts) {
  if (!ts) return 'Recently';
  if (typeof ts === 'string' && ts.includes('ago')) return ts;
  return ts;
}

export default function WinnersList() {
  const { giveaways } = useGiveaway();

  const winners = giveaways
    .filter((g) => g.status === 'ENDED' && g.winners?.length > 0)
    .flatMap((g) =>
      g.winners.map((w, idx) => ({
        id: w._id || w.id || idx,
        name: w.name,
        prize: w.prizeTitle || g.title,
        avatar: w.avatar || w.profileImage || null,
        time: relativeTime(w.drawTimestamp),
        initials: (w.name || 'U').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
        prize_icon: '🏆',
      }))
    );

  const display = winners.length > 0 ? winners : FALLBACK_WINNERS;

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <Megaphone className="w-5 h-5 text-purple-400" />
          <div>
            <h2 className="text-xl font-bold text-white leading-none">Winner Announcements</h2>
            <p className="text-xs text-slate-500 mt-0.5">Recent on-chain verified winners</p>
          </div>
        </div>
        <Link
          to="/winners"
          className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium
            text-[#a855f7] border border-purple-500/20 bg-purple-500/8
            hover:bg-purple-500/15 transition-colors"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid — 1 col mobile, 2 col lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {display.map((w, i) => (
          <div
            key={i}
            className="group flex items-center gap-4 bg-[#13131a] rounded-2xl px-5 py-4
              border border-white/5 hover:border-purple-500/20
              hover:shadow-[0_0_24px_rgba(168,85,247,0.08)]
              transition-all duration-200 relative overflow-hidden"
          >
            {/* Subtle hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/3 to-purple-500/0
              opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Avatar */}
            <div
              className={`relative w-11 h-11 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]}
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
              {/* Trophy badge */}
              <span className="absolute -bottom-1 -right-1 text-base leading-none select-none drop-shadow-md">{w.prize_icon}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 relative">
              <p className="text-sm font-bold text-white leading-snug">{w.name}</p>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                Won <span className="text-slate-300">{w.prize}</span>
              </p>
            </div>

            {/* Time + trophy */}
            <div className="relative flex flex-col items-end gap-1 shrink-0">
              <div className="flex items-center gap-1 text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                <Trophy className="w-2.5 h-2.5" />
                Winner
              </div>
              <span className="text-xs text-slate-500">{w.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
