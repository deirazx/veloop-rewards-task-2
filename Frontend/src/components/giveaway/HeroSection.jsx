import React from 'react';
import { motion } from 'framer-motion';
import { Gift, ArrowRight, ShieldCheck, Trophy, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGiveaway } from '../../context/GiveawayContext';

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&q=80&auto=format&fit=crop',
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Provably Fair' },
  { icon: Trophy,      label: '1,420+ Winners' },
  { icon: Zap,         label: 'Instant Dispatch' },
];

export default function HeroSection() {
  const { giveaways } = useGiveaway();
  const activeList = (giveaways || []).filter((g) => g.status === 'ACTIVE');
  const featured =
    activeList.find((g) => g.featured) ||
    activeList.find((g) => g.slug?.includes('iphone') || g.title?.toLowerCase().includes('iphone')) ||
    activeList[0];
  const targetLink = featured ? `/giveaway/${featured.slug || featured.id}` : '/giveaway/apple-iphone-15-pro-256gb';

  return (
    <section className="relative rounded-3xl overflow-hidden
      bg-gradient-to-br from-[#14092b] via-[#0f0b1c] to-[#09090b]
      border border-purple-500/15 shadow-2xl">

      {/* Ambient glows */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-purple-700/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-500/8 blur-[80px] pointer-events-none" />
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

          {/* Subtitle */}
          <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
            Complete activities, collect entries &amp; get a chance to win exciting rewards.
            Provably fair — every winner verified on-chain.
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
                <div className="text-sm font-bold text-white">8.5K+</div>
                <div className="text-xs text-gray-400">Users Participating</div>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-white/10" />

            {/* Trust badges */}
            <div className="flex items-center gap-4">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Icon className="w-3.5 h-3.5 text-purple-400" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ─── RIGHT COLUMN — hero graphic / prize showcase ─────────── */}
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex-1 flex items-center justify-center w-full max-w-sm lg:max-w-md xl:max-w-lg"
        >
          {/* Try to load hero graphic */}
          <img
            src="/assets/hero-graphic.png"
            alt="Giveaway rewards graphic"
            className="w-full object-contain drop-shadow-2xl"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextSibling.style.display = 'flex';
            }}
          />

          {/* Decorative fallback card stack when image is missing */}
          <div className="hidden w-full aspect-square max-w-sm items-center justify-center relative">
            {/* Back card */}
            <div className="absolute w-52 h-52 rounded-3xl bg-gradient-to-br from-purple-900/60 to-[#09090b]
              border border-purple-500/20 rotate-12 translate-x-6 translate-y-4 shadow-2xl" />
            {/* Middle card */}
            <div className="absolute w-52 h-52 rounded-3xl bg-gradient-to-br from-amber-900/40 to-[#09090b]
              border border-amber-500/20 -rotate-6 -translate-x-4 translate-y-2 shadow-2xl" />
            {/* Front card */}
            <div className="relative w-56 h-56 rounded-3xl bg-gradient-to-br from-[#1a0a3e] to-[#0d0318]
              border border-purple-500/40 shadow-2xl shadow-purple-900/30
              flex flex-col items-center justify-center gap-4 p-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#a855f7]
                flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.5)]">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-lg">Win Prizes</div>
                <div className="text-purple-300 text-sm">Fair &amp; Transparent</div>
              </div>
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-3xl border border-purple-400/20 shadow-[inset_0_0_40px_rgba(168,85,247,0.1)]" />
            </div>
            {/* Floating coins decorations */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 + i * 0.5, delay: i * 0.4, ease: 'easeInOut' }}
                className="absolute w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500
                  shadow-[0_0_20px_rgba(251,191,36,0.5)] flex items-center justify-center text-white font-bold text-sm"
                style={{
                  top:  `${20 + i * 25}%`,
                  right: `${5 + i * 8}%`,
                }}
              >
                ₹
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
