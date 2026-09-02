import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How are the winners selected fairly?',
    a: 'Every giveaway uses an audited provably fair pseudo-random number generator (PRNG) seeded by blockhash data. The draw seed and ticket hashes are published publicly in the Winners Portal for independent verification.'
  },
  {
    q: 'What is the difference between VEs, SVEs, and Community Tokens?',
    a: 'VEs (Veloop Entries) are primary reward credits. SVEs (Super VEs) are earned via high-tier platform achievements and unlock exclusive hardware pools like AirPods Pro. Community Tokens are high-liquidity micro-credits used for daily vouchers.'
  },
  {
    q: 'Can I enter a single giveaway pool multiple times?',
    a: 'No. To guarantee equal chances and prevent syndicate bot abuse, each KYC-verified user account is restricted to exactly 1 entry per round.'
  },
  {
    q: 'How long does prize dispatch take?',
    a: 'Digital gift cards (Amazon, Steam, Recharge) are dispatched within 15 minutes of email submission. Physical electronics (iPhone, Apple Watch) are dispatched via insured express courier within 3-5 business days.'
  }
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="py-12 border-t border-slate-800/80">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase font-bold tracking-wider text-reward-gold block mb-1">
          Help &amp; Guidelines
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-deep-card border border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/50 transition"
              >
                <span className="text-sm font-bold text-white">{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-purple-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
