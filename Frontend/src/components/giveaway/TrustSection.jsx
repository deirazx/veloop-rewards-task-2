import React from 'react';
import { ShieldCheck, Lock, Award, Eye, CheckCircle2, Sparkles } from 'lucide-react';

const trustPillars = [
  {
    icon: Eye,
    tag: '100% Transparent',
    title: 'Provably Fair RNG',
    desc: 'Publicly verifiable random numbers prevent tampering and guarantee legitimate winners with immutable cryptographic seed hashes.',
    color: 'purple'
  },
  {
    icon: Lock,
    tag: 'Secure & Encrypted',
    title: 'Encrypted Data Claims',
    desc: 'Shipping addresses and gift card voucher pins are end-to-end encrypted with zero third-party disclosure or tracking.',
    color: 'emerald'
  },
  {
    icon: ShieldCheck,
    tag: 'Fair Participation',
    title: 'Sybil-Proof Entry Pools',
    desc: 'Strict 1 entry limit per verified KYC account prevents whale dominance and bot abuse for genuinely equal winning odds.',
    color: 'cyan'
  },
  {
    icon: Award,
    tag: '100% Genuine Rewards',
    title: 'Direct Retail Fulfillment',
    desc: 'Official manufacturer warranties for physical tech and authorized direct digital gift cards from verified merchants.',
    color: 'amber'
  }
];

export default function TrustSection() {
  return (
    <section id="trust" className="py-12 border-t border-slate-800/80">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Industry Gold Standard
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          100% Transparent, Secure &amp; Fair Participation
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          VELOOP Rewards is built from the ground up on cryptographic integrity, zero-cheat RNG algorithms, and tamper-resistant prize fulfillment.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {trustPillars.map((b, i) => {
          const Icon = b.icon;
          return (
            <div
              key={i}
              className="relative p-6 rounded-3xl bg-[#0f111a] border border-slate-800/90 hover:border-slate-700 transition flex flex-col justify-between shadow-lg group hover:-translate-y-1 duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:text-amber-400 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 uppercase tracking-wider">
                    {b.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {b.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Standard</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
