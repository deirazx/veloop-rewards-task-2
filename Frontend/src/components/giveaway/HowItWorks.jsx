import React from 'react';
import { Coins, CheckCircle, Trophy, PackageCheck } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Select Active Pool',
    desc: 'Browse physical luxury tech or instant digital vouchers and review required VEs, SVEs, or Tokens.',
    icon: Coins
  },
  {
    step: '02',
    title: 'Confirm Balance & Lock Spot',
    desc: 'Automated balance verification ensures zero overdraw. Confirm entry to securely reserve your ticket ID.',
    icon: CheckCircle
  },
  {
    step: '03',
    title: 'Provably Fair Draw',
    desc: 'Once countdown hits zero, on-chain RNG picks the winning ticket number with immutable cryptographic proof.',
    icon: Trophy
  },
  {
    step: '04',
    title: 'Claim Your Prize',
    desc: 'Winners submit their shipping address for physical goods or recipient email for instant gift card delivery.',
    icon: PackageCheck
  }
];

export default function HowItWorks() {
  return (
    <div className="py-12 border-t border-slate-800/80">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase font-bold tracking-wider text-accent-purple block mb-1">
          Simple &amp; Transparent
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          How Veloop Giveaways Work
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="relative p-6 rounded-3xl bg-deep-card border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-purple-400/40">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center text-reward-gold">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mt-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
