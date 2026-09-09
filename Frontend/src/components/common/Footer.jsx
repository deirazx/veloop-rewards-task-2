import React from 'react';
import {
  Gift,
  ShieldCheck,
  Trophy,
  Ticket,
  Coins,
  Zap,
  Sparkles,
  ArrowUpRight,
  Lock,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#08060f] border-t border-purple-500/20 text-slate-400 text-xs pt-12 pb-24 md:pb-12 relative overflow-hidden">
      {/* Top ambient glow blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-purple-600/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* ── Top Row: Brand & Live Protocol Status ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="space-y-2 max-w-md">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-black border border-white/15 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.35)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all">
                <img
                  src="/logo.jpeg"
                  alt="VELOOP Logo"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => { e.currentTarget.src = '/assets/logo.jpeg'; }}
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-extrabold tracking-wide text-white">VELOOP</span>
                <span className="text-[10px] font-extrabold tracking-[0.22em] text-[#a855f7] mt-0.5">REWARDS</span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier provably fair community rewards protocol. Enter verified draws for luxury electronics, gift cards, and micro-rewards with transparent cryptographic auditing.
            </p>
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Protocol: 100% Operational</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>SHA-256 PRNG Audited</span>
            </div>
          </div>
        </div>

        {/* ── Middle Grid: Rich Navigation Directories ── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Col 1: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-purple-400" /> Platform Pools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/#active-giveaways" className="hover:text-purple-300 transition flex items-center gap-1">
                  Active Giveaways <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">LIVE</span>
                </Link>
              </li>
              <li>
                <Link to="/giveaway/apple-iphone-15-pro-256gb" className="hover:text-purple-300 transition">
                  Apple iPhone 15 Pro
                </Link>
              </li>
              <li>
                <Link to="/giveaway/amazon-2000-shopping-gift-voucher" className="hover:text-purple-300 transition">
                  Amazon ₹2,000 Voucher
                </Link>
              </li>
              <li>
                <Link to="/giveaway/apple-watch-series-9-gps" className="hover:text-purple-300 transition">
                  Apple Watch Series 9
                </Link>
              </li>
              <li>
                <Link to="/giveaway/20-instant-recharge-voucher" className="hover:text-purple-300 transition">
                  Daily Micro-Recharge
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Hubs & Draws */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Hubs & Draws
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/#leaderboard" className="hover:text-purple-300 transition flex items-center gap-1">
                  3D Champions Podium
                </Link>
              </li>
              <li>
                <Link to="/winners" className="hover:text-purple-300 transition flex items-center gap-1">
                  Audited Winners Hub <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/entries" className="hover:text-purple-300 transition flex items-center gap-1">
                  My Tickets & Entries
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-purple-300 transition">
                  Member Wallet & Balances
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Currencies */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" /> Currencies
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
                <span className="text-slate-300 font-medium">VEs Platform Coins</span>
              </li>
              <li className="flex items-center gap-2">
                <Coins className="w-3 h-3 text-amber-400" />
                <span className="text-slate-300 font-medium">SVEs Staked Coins</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span className="text-slate-300 font-medium">Community Tokens</span>
              </li>
              <li className="pt-1">
                <span className="text-[11px] text-slate-400 block leading-snug">
                  Earn tokens through daily logins, activities, and community challenges.
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> Security & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Provably Fair SHA-256</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Masked Identity Protection</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Tamper-Proof Draw Seed</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Anti-Sybil Device Locks</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Row: Copyright, Compliance & Attribution ── */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 text-center md:text-left">
          <div className="space-y-1">
            <p>
              &copy; {currentYear} VELOOP Rewards Protocol. All rights reserved.
            </p>
            <p className="text-[10px] text-slate-400">
              Not affiliated with Apple Inc., Amazon.com, or Sony Interactive Entertainment. All prize trademarks remain property of their respective owners.
            </p>
          </div>

          <div className="flex items-center gap-2 text-slate-400 shrink-0">
            <span>Built with precision for</span>
            <span className="font-semibold text-purple-300">Verified Web3 Rewards</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
