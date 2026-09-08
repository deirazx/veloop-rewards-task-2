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
      {endedGiveaways.length === 0 ? (
        <div className="rounded-3xl bg-[#13131a] border border-white/5 p-10 sm:p-14 text-center max-w-md mx-auto space-y-3 shadow-[0_0_24px_rgba(0,0,0,0.4)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 shadow-inner mx-auto mb-1">
            <Trophy className="w-7 h-7 text-slate-500/70" />
          </div>
          <p className="text-sm text-gray-400 font-medium">
            Previous winners will appear here after a giveaway is completed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {endedGiveaways.map((item) => {
            // Strict Winner Identity Check (Clause #26 & #34)
            const userWinnerRecord = item.winners?.find(
              (w) =>
                (currentUser?.customUserId && w.customUserId === currentUser.customUserId) ||
                (currentUser?.id && w.userId === currentUser.id) ||
                (currentUser?.customUserId && w.userId === currentUser.customUserId)
            );
            const hasUserClaimed = claims[item.id] || userWinnerRecord?.claimStatus === 'CLAIMED';

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-[#13131a] border border-white/8 overflow-hidden shadow-2xl relative"
              >
              {/* Exclusive Winner Claim Banner */}
              {userWinnerRecord ? (
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
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Claim Submitted</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenClaim(item, item.type)}
                        className="px-5 py-2.5 rounded-xl font-bold text-obsidian bg-reward-gold hover:bg-amber-400 transition shadow-[0_4px_20px_rgba(245,158,11,0.5)] flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <Gift className="w-4 h-4" />
                        <span>Claim Prize</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : currentUser ? (
                /* Supportive Non-Winner Message (Clause #26 & #34) */
                <div className="bg-slate-900/60 px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Better luck next time! Keep participating in active pools to claim upcoming rewards.</span>
                  </span>
                  <a href="/" className="text-purple-400 font-bold hover:underline shrink-0">
                    Explore Active Pools →
                  </a>
                </div>
              ) : null}

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
                    <div className="text-xs uppercase font-semibold text-slate-400 flex items-center gap-2 mb-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Official Verified Winners ({item.winners?.length || 0})</span>
                    </div>

                    <div className="space-y-2.5">
                      {item.winners && item.winners.length > 0 ? (
                        item.winners.map((winner, idx) => {
                          const isMe =
                            (currentUser?.customUserId && winner.customUserId === currentUser.customUserId) ||
                            (currentUser?.id && winner.userId === currentUser.id);

                          const rawStatus = (winner.claimStatus || '').toUpperCase();
                          const effectiveStatus = (isMe && hasUserClaimed)
                            ? 'Claim Submitted'
                            : (rawStatus === 'CLAIMED' || rawStatus === 'COMPLETED')
                            ? 'Completed'
                            : rawStatus === 'PROCESSING'
                            ? 'Processing'
                            : 'Claim Prize';

                          const statusColors = {
                            'Claim Prize': 'bg-amber-500/20 text-reward-gold border-amber-500/30',
                            'Claim Submitted': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                            'Processing': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                            'Completed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                          }[effectiveStatus] || 'bg-slate-800 text-slate-300 border-slate-700';

                          const maskedId = winner.maskedUserId || (winner.customUserId ? `${winner.customUserId.slice(0, 2)}****${winner.customUserId.slice(-2)}` : 'VE****00');

                          return (
                            <div
                              key={idx}
                              className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                                isMe
                                  ? 'bg-purple-950/30 border-purple-500/40 text-white'
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
                                  {maskedId.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                                    <span>{maskedId}</span>
                                    {isMe && (
                                      <span className="px-1.5 py-0.2 rounded bg-accent-purple text-[10px] text-white">
                                        YOU
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-slate-500 font-mono text-[11px]">
                                    Ticket: {winner.ticketNumber} • {winner.drawTimestamp ? new Date(winner.drawTimestamp).toLocaleDateString() : 'Audited'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColors}`}
                                >
                                  {effectiveStatus}
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
      )}

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
