import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';

const mockTickerWinners = [
  { user: 'VE****42', prize: 'iPhone 15 Pro', amount: '250 VEs', time: '12m ago' },
  { user: 'VE****89', prize: '₹2,000 Amazon Voucher', amount: '500 VEs', time: '28m ago' },
  { user: 'VE****15', prize: 'AirPods Pro Gen 2', amount: '500 SVEs', time: '1h ago' },
  { user: 'VE****63', prize: 'Apple Watch S9', amount: '200 VEs', time: '3h ago' },
  { user: 'VE****77', prize: '₹20 Instant Voucher', amount: '2,000 Tokens', time: '4h ago' }
];

export default function WinnerMarquee() {
  return (
    <div className="w-full bg-deep-card/80 border-y border-slate-800/80 py-2.5 overflow-hidden mb-10 flex items-center">
      <div className="px-4 shrink-0 flex items-center gap-2 border-r border-slate-800 text-xs font-bold text-reward-gold">
        <Trophy className="w-3.5 h-3.5" />
        <span className="uppercase tracking-wider font-mono">Live Winners:</span>
      </div>

      <div className="flex overflow-hidden relative w-full select-none">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 25,
              ease: 'linear'
            }
          }}
          className="flex items-center gap-8 whitespace-nowrap pl-4"
        >
          {[...mockTickerWinners, ...mockTickerWinners, ...mockTickerWinners].map((w, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
              <span className="font-mono text-reward-gold font-bold bg-obsidian px-1.5 py-0.5 rounded border border-slate-800">
                {w.user}
              </span>
              <span className="text-slate-500">won</span>
              <strong className="text-white font-medium">{w.prize}</strong>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-purple/20 text-purple-300 font-mono">
                {w.amount}
              </span>
              <span className="text-[10px] text-slate-500">• {w.time}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
