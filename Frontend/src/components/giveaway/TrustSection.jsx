import React from 'react';
import { ShieldCheck, Lock, Award, Eye } from 'lucide-react';

const badges = [
  {
    icon: ShieldCheck,
    title: 'Provably Fair RNG',
    desc: 'Publicly verifiable random numbers prevent tampering and guarantee legitimate winners.'
  },
  {
    icon: Lock,
    title: 'Encrypted Claims',
    desc: 'Shipping addresses and gift card voucher pins are end-to-end encrypted.'
  },
  {
    icon: Award,
    title: '100% Genuine Items',
    desc: 'Official manufacturer warranties and authorized direct retailer gift cards.'
  },
  {
    icon: Eye,
    title: 'Transparent Ledger',
    desc: 'Full visibility over pool capacity, participant count, and ticket allocation.'
  }
];

export default function TrustSection() {
  return (
    <div className="py-10 border-t border-slate-800/80">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((b, i) => {
          const Icon = b.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-deep-card/50 border border-slate-800/80 flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center text-reward-gold shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {b.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
