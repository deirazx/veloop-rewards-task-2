import React, { useState } from 'react';
import { Sparkles, Filter, Gift, Package, CreditCard } from 'lucide-react';
import { useGiveaway } from '../context/GiveawayContext';
import HeroBanner from '../components/giveaway/HeroBanner';
import WinnerMarquee from '../components/giveaway/WinnerMarquee';
import PrizeCard from '../components/giveaway/PrizeCard';
import HowItWorks from '../components/giveaway/HowItWorks';
import FAQSection from '../components/giveaway/FAQSection';
import TrustSection from '../components/giveaway/TrustSection';

export default function HomePage() {
  const { giveaways } = useGiveaway();
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'PHYSICAL', 'GIFT_CARD'

  // Filter only active giveaways for the main discovery grid
  const activeGiveaways = giveaways.filter((g) => g.status === 'ACTIVE');

  const filteredItems = activeGiveaways.filter((g) => {
    if (filterType === 'ALL') return true;
    return g.type === filterType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Banner with Dynamic Stats */}
      <HeroBanner />

      {/* Auto-scrolling Ticker */}
      <WinnerMarquee />

      {/* Discovery Section Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Active Reward Pools
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Click any prize card to view details, verify entry balances, and enter the provably fair draw.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-deep-card border border-slate-800 self-stretch sm:self-auto">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'ALL'
                ? 'bg-accent-purple text-white shadow-md shadow-purple-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Rewards ({activeGiveaways.length})
          </button>

          <button
            onClick={() => setFilterType('PHYSICAL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'PHYSICAL'
                ? 'bg-accent-purple text-white shadow-md shadow-purple-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Hardware Only</span>
          </button>

          <button
            onClick={() => setFilterType('GIFT_CARD')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'GIFT_CARD'
                ? 'bg-accent-purple text-white shadow-md shadow-purple-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Digital Cards</span>
          </button>
        </div>
      </div>

      {/* Prize Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredItems.map((giveaway) => (
          <PrizeCard key={giveaway.id} giveaway={giveaway} />
        ))}
      </div>

      {/* 4-Step Participation Timeline */}
      <HowItWorks />

      {/* Transparency & Security Trust Badges */}
      <TrustSection />

      {/* FAQs Section */}
      <FAQSection />
    </div>
  );
}
