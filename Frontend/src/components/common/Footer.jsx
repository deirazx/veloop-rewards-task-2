import React from 'react';
import { Gift, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-obsidian text-slate-400 text-xs py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-deep-card border border-slate-700 flex items-center justify-center">
              <Gift className="w-4 h-4 text-reward-gold" />
            </div>
            <span className="font-bold text-white text-sm">VELOOP REWARDS PROTOCOL</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link to="/" className="hover:text-white transition">Discovery</Link>
            <Link to="/winners" className="hover:text-white transition">Winners Portal</Link>
            <a href="#rules" className="hover:text-white transition">Terms of Service</a>
            <a href="#fairness" className="hover:text-white transition">Fairness Proofs</a>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Regulated Non-Gambling Skill Points Pool</span>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} Veloop Protocol Inc. All rights reserved. Not affiliated with Apple Inc. or Amazon.com.</p>
          <p className="flex items-center gap-1">
            Engineered with <span className="text-purple-400">precision</span> for verified community rewards
          </p>
        </div>
      </div>
    </footer>
  );
}
