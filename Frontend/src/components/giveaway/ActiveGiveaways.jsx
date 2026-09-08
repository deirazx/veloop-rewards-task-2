import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Filter, Package, CreditCard } from 'lucide-react';
import { useGiveaway } from '../../context/GiveawayContext';
import PrizeCard from './PrizeCard';

export default function ActiveGiveaways() {
  const { giveaways } = useGiveaway();
  const [filter, setFilter] = useState('ALL');

  const activeGiveaways = giveaways.filter((g) => g.status === 'ACTIVE');
  const filtered = activeGiveaways.filter((g) => {
    if (filter === 'ALL')       return true;
    if (filter === 'PHYSICAL')  return g.type === 'PHYSICAL';
    if (filter === 'GIFT_CARD') return g.type === 'GIFT_CARD';
    return true;
  });

  const FILTERS = [
    { id: 'ALL',       label: `All Rewards (${activeGiveaways.length})`, icon: null },
    { id: 'PHYSICAL',  label: 'Hardware',                                icon: Package },
    { id: 'GIFT_CARD', label: 'Digital Cards',                           icon: CreditCard },
  ];

  return (
    <section className="w-full">
      {/* ── Section header + filter pills ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7">
        <div className="flex items-center gap-2.5">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <div>
            <h2 className="text-xl font-bold text-white leading-none">Active Giveaways</h2>
            <p className="text-xs text-slate-400 mt-0.5">Explore our active premium reward pools</p>
          </div>
          {/* Live dot */}
          <span className="flex items-center gap-1 ml-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter chips */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#13131a] border border-white/5">
            {FILTERS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter === id
                    ? 'bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setFilter('ALL');
              document.getElementById('active-giveaways-grid')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden sm:flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium
              text-[#a855f7] border border-purple-500/20 bg-purple-500/8
              hover:bg-purple-500/15 transition-colors cursor-pointer"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Card Grid ──
           Mobile:  1 col (full card)
           Tablet:  2 cols
           Desktop: 3 cols
           XL:      4 cols (if many cards)
      ── */}
      {filtered.length > 0 ? (
        <div id="active-giveaways-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((giveaway) => (
            <PrizeCard key={giveaway.id} giveaway={giveaway} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500">
          <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No active giveaways in this category</p>
        </div>
      )}
    </section>
  );
}
