import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, ArrowRight, ShieldCheck, Trophy, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGiveaway } from '../../context/GiveawayContext';
import api from '../../services/api';

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&q=80&auto=format&fit=crop',
];

export default function HeroSection() {
  const { giveaways } = useGiveaway();
  const [platformStats, setPlatformStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.fetchPlatformStats().then((data) => {
      if (isMounted && data) setPlatformStats(data);
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const totalParts = platformStats?.totalParticipants ?? (giveaways || []).reduce(
    (acc, g) => acc + Number(g.participantsCount || g.spotsTaken || 0),
    0
  );
  const participantsDisplay = totalParts >= 1000
    ? `${(totalParts / 1000).toFixed(1)}K+`
    : `${totalParts.toLocaleString()}`;

  const prizesWon = platformStats?.prizesWon ?? (giveaways || []).reduce((acc, g) => acc + (g.winners?.length || 0), 0);
  const winnersBadge = prizesWon > 0 ? `${prizesWon} Audited Winners` : 'Audited Winners';

  const trustBadges = [
    { icon: ShieldCheck, label: 'Transparent Selection' },
    { icon: Trophy,      label: winnersBadge },
    { icon: Zap,         label: 'Instant Dispatch' },
  ];

  const activeList = (giveaways || []).filter((g) => g.status === 'ACTIVE');
  const featured =
    activeList.find((g) => g.featured) ||
    activeList.find((g) => g.slug?.includes('iphone') || g.title?.toLowerCase().includes('iphone')) ||
    activeList[0];
  const targetLink = featured ? `/giveaway/${featured.slug || featured.id}` : '/giveaway/iphone-15-pro';

  return (
    <section className="relative rounded-3xl overflow-hidden
      bg-gradient-to-br from-[#14092b] via-[#0f0b1c] to-[#09090b]
      border border-purple-500/15 shadow-2xl">

      {/* Ambient glows */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-purple-700/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-600/10 blur-[80px] pointer-events-none" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(168,85,247,0.8) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(168,85,247,0.8) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 p-8 md:p-12 lg:p-16">

        {/* ─── LEFT COLUMN ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6 lg:space-y-8 text-center lg:text-left"
        >
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
            bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-widest">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            Exclusive Giveaway
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight">
              Giveaway
            </h1>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight
              text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-[#a855f7] to-purple-300">
              Rewards
            </h1>
          </div>

          {/* Subtitle (Fintech style, no gambling words) */}
          <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
            Complete activities, collect entries &amp; get a chance to win exciting rewards.
            Transparent reward selection — audited platform allocations.
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link
              to={targetLink}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl
                text-base font-bold text-white
                bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
                shadow-[0_0_28px_rgba(139,92,246,0.45)]
                hover:shadow-[0_0_40px_rgba(139,92,246,0.7)]
                hover:from-[#4F46E5] hover:to-[#7C3AED]
                transition-all duration-200 active:scale-95"
            >
              Join Giveaway
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/winners"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl
                text-base font-semibold text-slate-300
                border border-white/10 bg-white/5
                hover:border-white/20 hover:text-white
                transition-all duration-200"
            >
              View Winners
            </Link>
          </div>

          {/* Social proof + trust badges */}
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-2">
            {/* Avatars */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {AVATARS.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="user"
                    className="w-9 h-9 rounded-full border-2 border-[#14092b] object-cover"
                  />
                ))}
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white font-mono">{participantsDisplay}</div>
                <div className="text-xs text-gray-400">Active Participants</div>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-white/10" />

            {/* Trust badges (Transparent Selection) */}
            <div className="flex items-center gap-4">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Icon className="w-3.5 h-3.5 text-purple-400" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ─── RIGHT COLUMN — Sleek 3D Floating Apple iPhone 15 Pro Showcase ─── */}
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex-1 flex items-center justify-center w-full max-w-sm lg:max-w-md xl:max-w-lg relative"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 via-transparent to-indigo-500/10 rounded-3xl blur-2xl pointer-events-none" />

          {/* Floating 3D Showcase Container */}
          <Link to={targetLink} className="block w-full cursor-pointer">
            <motion.div
              animate={{ y: [-7, 7, -7] }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
                scale: { duration: 0.25 }
              }}
              className="relative w-full rounded-3xl overflow-hidden bg-[#100c1e]/80 border border-purple-500/20 p-3 sm:p-4 shadow-[0_20px_60px_-15px_rgba(124,58,237,0.3)] backdrop-blur-sm group"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-square bg-[#0b0816] flex items-center justify-center border border-white/5">
                <img
                  src="/assets/hero-iphone.jpg"
                  alt="Apple iPhone 15 Pro Titanium Giveaway Showcase"
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/iphone-prize.jpg';
                    e.currentTarget.className = 'w-3/4 object-contain drop-shadow-[0_15px_35px_rgba(124,58,237,0.4)]';
                  }}
                />

                {/* Floating Fintech Info Badges */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="truncate max-w-[140px] sm:max-w-[180px]">{featured?.title || 'Apple iPhone 15 Pro'}</span>
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-purple-950/75 backdrop-blur-md border border-purple-500/30 text-[10px] font-bold text-purple-300 shadow-lg flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Audited</span>
                </div>

                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-amber-500/30 text-[11px] font-bold text-amber-300 shadow-lg flex items-center gap-1.5 font-mono">
                  <span>Entry: {featured?.cost || 250} {featured?.currency || 'VEs'}</span>
                </div>

                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#a855f7] text-[11px] font-bold text-white shadow-[0_0_12px_rgba(168,85,247,0.5)] flex items-center gap-1 group-hover:scale-105 transition-all">
                  <span>Enter Draw</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
