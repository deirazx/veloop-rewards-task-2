import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, ArrowRight, ShieldCheck, Clock, Gift, Sparkles } from 'lucide-react';
import { useGiveaway } from '../context/GiveawayContext';

export default function MyEntriesPage() {
  const { giveaways, joinedGiveaways, currentUser } = useGiveaway();

  const enteredList = (giveaways || []).filter((g) =>
    (joinedGiveaways || []).includes(g.id) || (joinedGiveaways || []).includes(g._id)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 pb-24 md:pb-12 space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Ticket className="w-3.5 h-3.5" />
          <span>My Tickets & Draw Pools</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Participating Giveaways
        </h1>
        <p className="text-xs text-slate-400">
          Your active entries secured by on-chain transparent verification.
        </p>
      </div>

      {enteredList.length === 0 ? (
        <div className="rounded-3xl bg-[#13131a] border border-white/8 p-10 md:p-14 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
            <Gift className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Active Entries Yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            You haven't joined any live giveaway pools in this session. Explore our active reward pools and enter using your free token balance!
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white text-xs font-bold shadow-lg shadow-purple-900/30 hover:opacity-95 transition"
            >
              <span>Explore Reward Pools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enteredList.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#13131a] border border-emerald-500/30 p-5 space-y-4 shadow-lg relative overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full mb-1">
                    <Sparkles className="w-2.5 h-2.5" /> Ticket Active
                  </span>
                  <h3 className="text-sm font-bold text-white leading-snug truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Retail Price: <span className="text-slate-200 font-medium">{item.retailPrice}</span>
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#09090b] border border-white/5 text-xs flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Audited Draw</span>
                </div>
                <Link
                  to={`/giveaway/${item.slug || item.id}`}
                  className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
