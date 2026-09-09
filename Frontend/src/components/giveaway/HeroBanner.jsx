import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Trophy, ArrowUpRight, Flame, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#161D2C] to-deep-card border border-slate-800 p-8 md:p-12 shadow-2xl mb-12">
      {/* Background Decorative Mesh & Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent-purple/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-reward-gold/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-purple/20 border border-accent-purple/40 text-purple-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-reward-gold" />
          <span>Transparent &amp; Audited Community Giveaways</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Win Flagship Hardware &amp; Vouchers With Your{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-reward-gold bg-clip-text text-transparent">
            VEs &amp; SVEs
          </span>
        </h1>

        <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
          Zero automated bots, zero opaque decisions. Every winner is audited on-chain via cryptographically verifiable random numbers. Claim physical items directly to your doorstep or receive instant digital gift vouchers.
        </p>

        {/* Dynamic Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
          <div>
            <span className="text-[11px] font-mono text-slate-400 block uppercase">Total Dispatched</span>
            <span className="text-xl md:text-2xl font-extrabold text-white font-mono">₹48,20,000+</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 block uppercase">Verified Winners</span>
            <span className="text-xl md:text-2xl font-extrabold text-reward-gold font-mono">1,420+</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 block uppercase">Active Pools</span>
            <span className="text-xl md:text-2xl font-extrabold text-purple-400 font-mono">5 Live</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 block uppercase">Verification Audit</span>
            <span className="text-xl md:text-2xl font-extrabold text-emerald-400 font-mono">100% On-Chain</span>
          </div>
        </div>
      </div>
    </div>
  );
}
