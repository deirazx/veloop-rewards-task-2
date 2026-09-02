import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useGiveaway } from '../../context/GiveawayContext';

export default function CurrentWinnersTab() {
  const { giveaways, hasJoined } = useGiveaway();

  // Filter active giveaways
  const activeGiveaways = giveaways.filter((g) => g.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-deep-card/60 border border-slate-800 text-slate-300 text-sm flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-reward-gold shrink-0" />
        <span>
          <strong>Live Drawings Notice:</strong> All events in this tab are currently live. In accordance with platform integrity policies, winning tickets are selected via verified RNG strictly after the pool countdown reaches zero.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeGiveaways.map((item) => {
          const joined = hasJoined(item.id);
          const percent = Math.round((item.spotsTaken / item.totalSpots) * 100);

          return (
            <div
              key={item.id}
              className="rounded-3xl bg-deep-card border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div className="p-6">
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-purple/20 text-purple-300 border border-accent-purple/30">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live Drawing Active</span>
                  </div>
                </div>

                {/* Title & Preview */}
                <div className="flex gap-4 items-center mb-5">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-800 shrink-0"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Prize Value: <strong className="text-slate-200">{item.retailPrice}</strong>
                    </p>
                    <div className="mt-1 text-xs font-semibold text-reward-gold">
                      Entry: {item.cost} {item.currency}
                    </div>
                  </div>
                </div>

                {/* Status Callout Box */}
                <div className="p-3.5 rounded-xl bg-obsidian/80 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-300 font-medium">
                    <Clock className="w-4 h-4 text-reward-gold shrink-0" />
                    <span>Giveaway is still live. Winners announced post-countdown.</span>
                  </div>
                  
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-accent-purple h-full rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{item.spotsTaken} / {item.totalSpots} spots taken</span>
                    <span>{percent}% full</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-obsidian/60 border-t border-slate-800 flex items-center justify-between">
                {joined ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    ✓ Your Ticket is Active
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">
                    You haven't entered yet
                  </span>
                )}

                <Link
                  to={`/giveaway/${item.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent-purple hover:text-purple-300 transition"
                >
                  <span>{joined ? 'View Event Status' : 'Join Pool'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
