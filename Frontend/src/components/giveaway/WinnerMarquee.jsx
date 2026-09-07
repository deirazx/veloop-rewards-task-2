import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const WINNERS = [
  { user: 'VE****42', prize: 'iPhone 15 Pro', amount: '250 VEs', time: '12m ago' },
  { user: 'VE****89', prize: '₹2,000 Amazon Voucher', amount: '500 VEs', time: '28m ago' },
  { user: 'VE****15', prize: 'AirPods Pro Gen 2', amount: '500 SVEs', time: '1h ago' },
  { user: 'VE****63', prize: 'Apple Watch S9', amount: '200 VEs', time: '3h ago' },
  { user: 'VE****77', prize: '₹20 Instant Voucher', amount: '2,000 Tokens', time: '4h ago' },
];

export default function LiveWinnersTicker() {
  const items = [...WINNERS, ...WINNERS, ...WINNERS];

  return (
    <div className="w-full bg-[#13131a] border-y border-white/5 py-2 overflow-hidden flex items-center gap-0 mb-6">
      {/* Label */}
      <div className="px-3 shrink-0 flex items-center gap-1.5 border-r border-white/10 text-[11px] font-bold text-amber-400 font-mono uppercase tracking-wider">
        <Trophy className="w-3 h-3" />
        Live Winners:
      </div>

      {/* Scrolling strip */}
      <div className="flex overflow-hidden w-full select-none">
        <motion.div
          animate={{ x: ['0%', '-33.33%'] }}
          transition={{ repeat: Infinity, repeatType: 'loop', duration: 22, ease: 'linear' }}
          className="flex items-center gap-6 whitespace-nowrap pl-4"
        >
          {items.map((w, i) => (
            <span key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="font-mono font-bold text-amber-300 bg-black/30 px-1.5 py-0.5 rounded border border-amber-500/20">
                {w.user}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{w.time}</span>
              <span className="text-slate-500">{w.user.split('*')[0]}****{w.user.slice(-2)}</span>
              <span className="text-slate-500">won</span>
              <strong className="text-white font-medium">{w.prize}</strong>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
