import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How do I participate?',
    a: 'To participate, browse any active giveaway pool on the homepage, click "Join for [Entry Fee]" to open the individual details page, review the prize terms and eligibility rules, and confirm your ticket reservation. The required entry fee (VEs, SVEs, or Community Tokens) will be deducted from your verified account balance, locking in your unique cryptographic entry ticket.'
  },
  {
    q: 'How are winners selected?',
    a: 'Winners are selected using an audited, provably fair pseudo-random number generator (PRNG). Each draw uses a cryptographic seed hash derived from timestamp and blockhash data. When the countdown reaches zero or all spots are reserved, the PRNG executes automatically to select the winning ticket number. All draw seeds and ticket allocation hashes are published in the Winners Hub for public verification.'
  },
  {
    q: 'How do I claim my prize?',
    a: 'If your ticket is drawn as a winner, a "Claim Prize" button will appear in your Winners Portal and notification center. For digital voucher rewards (such as Amazon Gift Cards or Mobile Recharge), simply submit your recipient email address—the redemption PIN will be dispatched within 15 minutes. For luxury physical items (iPhone, Apple Watch), provide your residential address and contact number for insured express courier delivery.'
  },
  {
    q: 'Can I enter a single giveaway pool multiple times?',
    a: 'No. To guarantee equal chances and protect community members from whale syndicates or automated bots, each verified user account is strictly limited to exactly 1 entry per round.'
  },
  {
    q: 'What is the difference between VEs, SVEs, and Community Tokens?',
    a: 'VEs (Veloop Entries) are primary reward credits earned through regular activities. SVEs (Super VEs) are premium achievement coins required for flagship tier prizes (such as Apple iPhone and AirPods). Community Tokens are high-liquidity micro-credits used for daily vouchers and micro-recharges.'
  },
  {
    q: 'What happens if a prize is left unclaimed?',
    a: 'Winners have a 7 calendar-day window to complete their claim verification and submit delivery details. If a prize remains unclaimed after 7 days, it is forfeited and automatically re-pooled for future community giveaway rounds.'
  }
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="py-12 border-t border-slate-800/80 scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          Community Knowledge Base
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Everything you need to know about participating, winning, and claiming your rewards.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3.5">
        {faqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-colors overflow-hidden ${
                isOpen
                  ? 'bg-[#12131e] border-purple-500/40 shadow-lg shadow-purple-950/20'
                  : 'bg-[#0f111a] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 transition-colors cursor-pointer"
              >
                <span className={`text-sm sm:text-base font-bold transition-colors ${
                  isOpen ? 'text-purple-300' : 'text-white'
                }`}>
                  {item.q}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                  isOpen ? 'bg-purple-500/20 text-purple-300 rotate-180' : 'bg-white/5 text-slate-400'
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3 animate-fadeIn">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
