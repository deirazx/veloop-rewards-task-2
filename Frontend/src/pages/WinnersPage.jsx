import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useGiveaway } from '../context/GiveawayContext';
import CurrentWinnersTab from '../components/winners/CurrentWinnersTab';
import HistoryWinnersTab from '../components/winners/HistoryWinnersTab';

export default function WinnersPage() {
  const [activeTab, setActiveTab] = useState('concluded'); // 'live' or 'concluded'
  const { giveaways } = useGiveaway();

  const concludedCount = (giveaways || []).filter((g) => g.status === 'ENDED').length;
  const liveCount = (giveaways || []).filter((g) => g.status === 'ACTIVE').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-4 h-4" />
          <span>Provably Fair Verification Hub</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Winners & Prize Claims Portal
        </h1>

        <p className="text-sm text-slate-400">
          Transparent cryptographic draws. Inspect live countdowns, verify past winner allocations, and securely claim won rewards.
        </p>
      </div>

      {/* Tabs Control */}
      <div className="flex justify-center mb-8">
        <div className="p-1.5 rounded-2xl bg-[#13131a] border border-white/8 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('concluded')}
            className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'concluded'
                ? 'bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white shadow-lg shadow-purple-900/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Audited Concluded Draws</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 font-mono">
              {concludedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'live'
                ? 'bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white shadow-lg shadow-purple-900/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Live Drawings In Progress</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 font-mono">
              {liveCount}
            </span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'concluded' ? <HistoryWinnersTab /> : <CurrentWinnersTab />}
      </div>
    </div>
  );
}
