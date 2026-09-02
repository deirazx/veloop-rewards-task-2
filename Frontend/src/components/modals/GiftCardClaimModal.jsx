import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle2, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGiveaway } from '../../context/GiveawayContext';

export default function GiftCardClaimModal({ giveaway, isOpen, onClose }) {
  const { currentUser, claimPrize } = useGiveaway();
  const [email, setEmail] = useState(currentUser?.email || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !giveaway) return null;

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please provide a valid recipient email address.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await claimPrize(giveaway.id, {
        type: 'GIFT_CARD',
        prize: giveaway.title,
        email: email.trim()
      });

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.55 },
        colors: ['#10B981', '#7C3AED', '#F59E0B']
      });

      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to dispatch voucher pin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-deep-card border border-slate-700/80 shadow-2xl p-6 md:p-8"
        >
          {/* Top Edge Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-accent-purple to-reward-gold" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                Instant Digital Fulfillment
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Claim Digital Voucher
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-5">
            You won <strong className="text-white">{giveaway.title}</strong>! Physical shipping is not required. Provide strictly the target email where your encrypted gift card code and PIN will be dispatched.
          </p>

          {isSuccess ? (
            <div className="py-4 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-bold text-white">Voucher Code Dispatched!</h4>
              <p className="text-sm text-slate-300">
                Encrypted redemption voucher sent to: <strong className="text-emerald-300 block mt-1">{email}</strong>
              </p>
              <div className="p-3 bg-obsidian/70 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-reward-gold" />
                <span>Estimated inbox delivery: 5 to 15 minutes</span>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-semibold bg-accent-purple hover:bg-purple-600 text-white transition shadow-lg shadow-purple-950/50"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Recipient Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="name@example.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian border ${error ? 'border-red-500' : 'border-slate-700'} text-white text-sm focus:outline-none focus:border-accent-purple transition`}
                  />
                </div>
                {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                ✓ No physical shipping inputs required.<br />
                ✓ Code arrives with clear redemption instructions.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-teal-600 hover:to-emerald-500 transition shadow-lg shadow-emerald-950/50 flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Code...' : 'Dispatch Voucher'}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
