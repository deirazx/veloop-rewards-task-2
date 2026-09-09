import React, { useState, useRef } from 'react';
import { ArrowRight, Star, Package, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGiveaway } from '../../context/GiveawayContext';
import PrizeCard from './PrizeCard';

export default function ActiveGiveaways() {
  const { giveaways } = useGiveaway();
  const [filter, setFilter] = useState('ALL');
  const scrollRef = useRef(null);

  const activeGiveaways = giveaways.filter((g) => g.status === 'ACTIVE');
  const filtered = activeGiveaways.filter((g) => {
    if (filter === 'ALL')       return true;
    if (filter === 'PHYSICAL')  return g.type === 'PHYSICAL';
    if (filter === 'GIFT_CARD') return g.type === 'GIFT_CARD';
    return true;
  });

  const FILTERS = [
    { id: 'ALL',       label: `All (${activeGiveaways.length})`, icon: null },
    { id: 'PHYSICAL',  label: 'Hardware',                        icon: Package },
    { id: 'GIFT_CARD', label: 'Digital',                         icon: CreditCard },
  ];

  const scrollBy = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 360, behavior: 'smooth' });
  };

  return (
    <section id="active-giveaways" className="w-full scroll-mt-20">

      {/* Section header + filter pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7 px-1">
        <div className="flex items-center gap-2.5">
          <span className="relative flex items-center justify-center w-2.5 h-2.5 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <div>
            <h2 className="text-xl font-bold text-white leading-none">Active Giveaways</h2>
            <p className="text-xs text-slate-400 mt-0.5">Scroll to explore premium reward pools</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scrollBy(-1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-purple-500/20 hover:border-purple-500/30 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-purple-500/20 hover:border-purple-500/30 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-6 z-10 bg-gradient-to-r from-[#09090b] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-10 z-10 bg-gradient-to-l from-[#09090b] to-transparent" />

          <div
            ref={scrollRef}
            id="active-giveaways-grid"
            className="flex overflow-x-auto gap-5 pb-4 snap-x snap-mandatory scroll-smooth px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', touchAction: 'pan-x', WebkitOverflowScrolling: 'touch' }}
          >
            {filtered.map((giveaway) => (
              <div
                key={giveaway.id}
                className="flex-shrink-0 w-[290px] sm:w-[330px] snap-start"
              >
                <PrizeCard giveaway={giveaway} />
              </div>
            ))}
            <div className="flex-shrink-0 w-4" aria-hidden="true" />
          </div>

          <style>{`#active-giveaways-grid::-webkit-scrollbar { display: none; }`}</style>
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500">
          <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No active giveaways in this category</p>
        </div>
      )}

      {filtered.length > 1 && (
        <p className="sm:hidden text-center text-[11px] text-slate-600 mt-1 flex items-center justify-center gap-1">
          <ArrowRight className="w-3 h-3" /> Swipe to explore more rewards
        </p>
      )}
    </section>
  );
}
