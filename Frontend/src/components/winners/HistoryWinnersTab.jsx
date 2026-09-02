import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Gift, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useGiveaway } from '../../context/GiveawayContext';
import PhysicalClaimModal from '../modals/PhysicalClaimModal';
import GiftCardClaimModal from '../modals/GiftCardClaimModal';

export default function HistoryWinnersTab() {
  const { giveaways, currentUser, claims } = useGiveaway();

  const [selectedGiveaway, setSelectedGiveaway] = useState(null);
  const [modalType, setModalType] = useState(null); // 'PHYSICAL' or 'GIFT_CARD'

  // Filter completed/ended giveaways
  const endedGiveaways = giveaways.filter((g) => g.status === 'ENDED');

  const handleOpenClaim = (giveaway, prizeType) => {
    setSelectedGiveaway(giveaway);
    setModalType(prizeType);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {endedGiveaways.map((item) => {
          // Check if current user is listed in winners
          const userWinnerRecord = item.winners?.find((w) => w.userId === currentUser.id);
          const hasUserClaimed = claims[item.id] || userWinnerRecord?.claimStatus === 'CLAIMED';

          return (
            <div
              key={item.id}
              className="rounded-3xl bg-deep-card border border-slate-800 overflow-hidden shadow-2xl relative"
            >
              {/* Exclusive Winner Claim Banner */}
              {userWinnerRecord && (
                <div className="bg-gradient-to-r from-accent-purple via-indigo-900 to-reward-gold/90 p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-purple-500/40">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-reward-gold shrink-0 shadow-lg">
                      <Trophy className="w-6 h-6 animate-bounce" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-reward-gold text-obsidian text-[10px] font-black uppercase tracking-wider">
                          Winner Verified
                        </span>
                        <span className="text-xs font-mono text-purple-200">
                          Ticket: {userWinnerRecord.ticketNumber}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-white mt-0.5">
                        Congratulations! You Won {item.title}!
                      </h4>
                    </div>
                  </div>

                  <div>
                    {hasUserClaimed ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Claim Verified & Locked</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenClaim(item, item.type)}
                        className="px-5 py-2.5 rounded-xl font-bold text-obsidian bg-reward-gold hover:bg-amber-400 transition shadow-[0_4px_20px_rgba(245,158,11,0.5)] flex items-center gap-2 text-sm"
                      >
                        <Gift className="w-4 h-4" />
                        <span>Claim Your Prize Now</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Main Content Area */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: Product Thumbnail & Meta */}
                  <div className="md:col-span-4 flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 rounded-2xl object-cover border border-slate-700/80 shrink-0"
                    />
                    <div>
                      <span className="text-xs font-mono text-slate-400 block mb-1">
                        Concluded Draw
                      </span>
                      <h3 className="text-base font-bold text-white leading-snug">
                        {item.title}
                      </h3>
                      <div className="text-xs text-slate-400 mt-1">
                        Value: <strong className="text-slate-200">{item.retailPrice}</strong>
                      </div>
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {item.type === 'PHYSICAL' ? '📦 Physical Delivery' : '⚡ Digital Code'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Confirmed Winners Roster */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="text-xs uppercase font-semibold text-slate-400 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Provably Fair RNG Winners ({item.winners?.length || 0})</span>
                    </div>

                    <div className="space-y-2">
                      {item.winners && item.winners.length > 0 ? (
                        item.winners.map((winner, idx) => {
                          const isMe = winner.userId === currentUser.id;
                          return (
                            <div
                              key={idx}
                              className={`p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs border ${
                                isMe
                                  ? 'bg-purple-950/40 border-accent-purple/60 text-purple-200'
                                  : 'bg-obsidian/80 border-slate-800 text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                    isMe
                                      ? 'bg-reward-gold text-obsidian'
                                      : 'bg-slate-800 text-slate-300'
                                  }`}
                                >
                                  {winner.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-white flex items-center gap-1.5">
                                    <span>{winner.name}</span>
                                    {isMe && (
                                      <span className="px-1.5 py-0.2 rounded bg-accent-purple text-[10px] text-white">
                                        YOU
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-slate-500 font-mono text-[11px]">
                                    Ticket: {winner.ticketNumber} • {winner.drawTimestamp}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="font-mono text-slate-400 text-[11px]">
                                  {winner.email}
                                </span>
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    winner.claimStatus === 'CLAIMED' || (isMe && hasUserClaimed)
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                      : 'bg-amber-500/20 text-reward-gold border border-amber-500/30'
                                  }`}
                                >
                                  {winner.claimStatus === 'CLAIMED' || (isMe && hasUserClaimed)
                                    ? 'Claim Dispatched'
                                    : 'Awaiting Claim'}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-4 rounded-xl bg-obsidian text-slate-500 text-xs text-center">
                          Winners pending audit certification.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Claim Modals */}
      {selectedGiveaway && modalType === 'PHYSICAL' && (
        <PhysicalClaimModal
          giveaway={selectedGiveaway}
          isOpen={true}
          onClose={() => {
            setSelectedGiveaway(null);
            setModalType(null);
          }}
        />
      )}

      {selectedGiveaway && modalType === 'GIFT_CARD' && (
        <GiftCardClaimModal
          giveaway={selectedGiveaway}
          isOpen={true}
          onClose={() => {
            setSelectedGiveaway(null);
            setModalType(null);
          }}
        />
      )}
    </div>
  );
}
