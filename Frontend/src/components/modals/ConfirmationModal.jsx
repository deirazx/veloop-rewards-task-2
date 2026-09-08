import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, AlertCircle, Coins, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGiveaway } from '../../context/GiveawayContext';

export default function ConfirmationModal({ giveaway, isOpen, onClose, onSuccess }) {
  const { getBalanceCheck, joinGiveaway, hasJoined } = useGiveaway();
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [joinedSuccess, setJoinedSuccess] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState('');

  if (!isOpen || !giveaway) return null;

  const alreadyJoined = hasJoined(giveaway.id);
  const balanceCheck = getBalanceCheck(giveaway.cost, giveaway.currency);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7C3AED', '#F59E0B', '#3B82F6', '#10B981']
    });
  };

  const handleConfirmJoin = async () => {
    if (alreadyJoined) {
      setErrorMsg("You're already participating in this giveaway.");
      return;
    }

    if (!agreedToTerms) {
      setErrorMsg("Please accept the giveaway rules to proceed.");
      return;
    }

    if (!balanceCheck.isSufficient) {
      setErrorMsg(`Insufficient ${giveaway.currency}. You need ${balanceCheck.deficit} more.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const prizeId = giveaway.prizes?.[0]?.prizeId || giveaway.prizeId || 'default';
      const result = await joinGiveaway(giveaway.id, giveaway.cost, giveaway.currency, prizeId);
      
      if (result?.ticketNumber) {
        setConfirmedTicket(result.ticketNumber);
      }
      
      triggerConfetti();
      setJoinedSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        {/* Modal Backdrop animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-deep-card border border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]"
        >
          {/* Header Accent Glow */}
          <div className="h-1.5 w-full bg-gradient-to-r from-accent-purple via-reward-gold to-accent-purple" />

          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 md:p-8">
            {/* Modal Title & Prize Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center shrink-0">
                <Coins className="w-6 h-6 text-reward-gold" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Confirm Participation
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-[280px] md:max-w-xs">
                  {giveaway.title}
                </p>
              </div>
            </div>

            {joinedSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Entry Locked Successfully!</h4>
                  <p className="text-sm text-slate-300 mt-1 max-w-sm mx-auto">
                    Your spot is guaranteed. The provably fair draw will execute once the event concludes.
                  </p>
                </div>
                <div className="p-3 bg-obsidian/60 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono">
                  Ticket ID: {confirmedTicket || `#${Math.floor(100000 + Math.random() * 900000)}`} • Deducted {giveaway.cost} {giveaway.currency}
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-3 mt-2 rounded-xl font-semibold bg-accent-purple hover:bg-purple-600 text-white transition shadow-lg shadow-purple-900/30"
                >
                  View My Giveaway Status
                </button>
              </motion.div>
            ) : alreadyJoined ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-reward-gold">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">You're Already Participating</h4>
                  <p className="text-sm text-slate-300 mt-1">
                    Your ticket is registered in this pool. Only 1 entry is permitted per verified user to ensure fair odds.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl font-medium bg-slate-800 hover:bg-slate-700 text-white transition border border-slate-700"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <>
                {/* Balance Breakdown Grid */}
                <div className="p-4 rounded-xl bg-obsidian/80 border border-slate-800 space-y-3 mb-6">
                  <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 pb-1 border-b border-slate-800/80">
                    Balance Breakdown
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Your Balance:</span>
                    <span className="font-semibold text-slate-200">
                      {balanceCheck.available.toLocaleString()} {giveaway.currency}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Entry Deduction:
                    </span>
                    <span className="font-bold text-rose-400">
                      - {giveaway.cost.toLocaleString()} {giveaway.currency}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
                    <span className="text-slate-300 font-medium">Balance After Joining:</span>
                    <span className={`font-bold ${balanceCheck.isSufficient ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {balanceCheck.remaining.toLocaleString()} {giveaway.currency}
                    </span>
                  </div>
                </div>

                {/* Deficit Alert if not enough */}
                {!balanceCheck.isSufficient && (
                  <div className="p-3.5 mb-5 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-rose-200">
                      <span className="font-semibold">Insufficient {giveaway.currency} Balance:</span> You are currently short by{' '}
                      <strong className="text-rose-300">{balanceCheck.deficit} {giveaway.currency}</strong>. Complete platform quests to top up your balance.
                    </div>
                  </div>
                )}

                {/* Terms Agreement Checkbox */}
                <div className="flex items-start gap-3 mb-6 p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <input
                    type="checkbox"
                    id="terms-check"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-700 bg-obsidian text-accent-purple focus:ring-accent-purple cursor-pointer"
                  />
                  <label htmlFor="terms-check" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
                    I agree to the <span className="text-purple-400 underline">Veloop Giveaway Rules</span> and authorize the non-reversible deduction of <strong className="text-white">{giveaway.cost} {giveaway.currency}</strong>.
                  </label>
                </div>

                {errorMsg && (
                  <div className="p-3 mb-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* CTA Action Buttons with Duplicate Lockout */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="w-1/3 py-3 rounded-xl font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmJoin}
                    disabled={isSubmitting || !balanceCheck.isSufficient || !agreedToTerms}
                    className="w-2/3 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-accent-purple to-purple-600 hover:from-purple-600 hover:to-accent-purple transition-all duration-200 shadow-lg shadow-purple-950/60 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Joining...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm & Join</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
