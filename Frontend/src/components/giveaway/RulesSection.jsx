import React from 'react';
import { UserCheck, Ticket, AlertOctagon, ShieldAlert, CheckCircle, Scale } from 'lucide-react';

export default function RulesSection() {
  return (
    <section id="rules" className="py-12 border-t border-slate-800/80 scroll-mt-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Scale className="w-3.5 h-3.5 text-reward-gold" />
          Official Protocol Specifications
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Giveaway Rules &amp; Guidelines
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Strict operational criteria ensuring complete fairness, transparency, and equal opportunity for every participant.
        </p>
      </div>

      {/* 3 Core Rule Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Rule 1: Eligibility */}
        <div className="relative rounded-3xl bg-[#0f111a] border border-purple-500/20 p-6 sm:p-7 flex flex-col justify-between shadow-xl hover:border-purple-500/40 transition group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-widest block mb-1">
                Section 44.1
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Participant Eligibility
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Open exclusively to verified VELOOP account holders aged 18 or older.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>One registered identity per person. Multiple synthetic accounts are prohibited.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Requires active community status or minimum qualifying platform balance.</span>
              </li>
            </ul>
          </div>
          <div className="pt-4 mt-6 border-t border-white/5 text-[11px] text-purple-300/80 font-medium">
            Strict KYC &amp; Verification enforced
          </div>
        </div>

        {/* Rule 2: Entry Rules */}
        <div className="relative rounded-3xl bg-[#0f111a] border border-cyan-500/20 p-6 sm:p-7 flex flex-col justify-between shadow-xl hover:border-cyan-500/40 transition group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                Section 44.2
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Entry Rules &amp; Allocation
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Strict limit of exactly <strong>1 entry ticket</strong> per user per giveaway round.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Entry fee (VEs, SVEs, or Tokens) is deducted and locked at confirmation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Every ticket receives a unique verifiable cryptographic sequence hash.</span>
              </li>
            </ul>
          </div>
          <div className="pt-4 mt-6 border-t border-white/5 text-[11px] text-cyan-300/80 font-medium">
            Non-reversible entry spot locking
          </div>
        </div>

        {/* Rule 3: Disqualification Policy */}
        <div className="relative rounded-3xl bg-[#0f111a] border border-rose-500/20 p-6 sm:p-7 flex flex-col justify-between shadow-xl hover:border-rose-500/40 transition group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-widest block mb-1">
                Section 44.3
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Disqualification Policy
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Automated bots, scripts, or Sybil ring manipulation result in instant bans.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Unclaimed rewards forfeit after 7 calendar days and are re-pooled.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Fraudulent address or identity submissions lead to permanent exclusion.</span>
              </li>
            </ul>
          </div>
          <div className="pt-4 mt-6 border-t border-white/5 text-[11px] text-rose-300/80 font-medium">
            Zero tolerance anti-cheat safeguards
          </div>
        </div>

      </div>
    </section>
  );
}
