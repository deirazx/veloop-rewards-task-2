import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  Coins
} from 'lucide-react';
import { useGiveaway } from '../context/GiveawayContext';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import CustomLoader from '../components/common/CustomLoader';

export default function GiveawayDetailsPage() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { giveaways, balances, hasJoined, getBalanceCheck, addFunds } = useGiveaway();

  const [loading, setLoading] = useState(true);
  const [giveaway, setGiveaway] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Match by slug or id
  const targetParam = slug || id;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const found = giveaways.find((g) => g.slug === targetParam || g.id === targetParam);
      setGiveaway(found || null);
      setLoading(false);
    }, 600); // realistic smooth loading display with CustomLoader

    return () => clearTimeout(timer);
  }, [targetParam, giveaways]);

  // Countdown clock simulation
  useEffect(() => {
    if (!giveaway) return;
    const calculateTime = () => {
      const difference = new Date(giveaway.endsAt).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [giveaway]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <CustomLoader />
      </div>
    );
  }

  if (!giveaway) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Giveaway Not Found</h2>
        <p className="text-slate-400 max-w-sm mb-6 text-sm">
          The giveaway pool you are looking for may have expired or is not configured.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-xl bg-accent-purple text-white font-medium hover:bg-purple-600 transition"
        >
          Return to Discovery
        </Link>
      </div>
    );
  }

  const alreadyJoined = hasJoined(giveaway.id);
  const balanceCheck = getBalanceCheck(giveaway.cost, giveaway.currency);
  const progressPercent = Math.round((giveaway.spotsTaken / giveaway.totalSpots) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Back Navigation & Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Giveaways</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Giveaways</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-accent-purple">{giveaway.category}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Showcase & Product Specs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Showcase Card */}
          <div className="relative overflow-hidden rounded-3xl bg-deep-card border border-slate-800 p-6 md:p-8 shadow-xl">
            {/* Ambient Backlight */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-accent-purple/20 blur-3xl pointer-events-none" />

            {/* Badges Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-purple/20 border border-accent-purple/40 text-purple-300">
                  {giveaway.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-reward-gold/20 border border-reward-gold/40 text-reward-gold">
                  {giveaway.type === 'PHYSICAL' ? '📦 Physical Delivery' : '⚡ Instant Digital Code'}
                </span>
              </div>

              <div className="text-xs font-mono text-slate-400 bg-obsidian/70 px-3 py-1 rounded-full border border-slate-800">
                Retail: <span className="text-slate-200 font-semibold">{giveaway.retailPrice}</span>
              </div>
            </div>

            {/* Prize Image Container */}
            <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden bg-obsidian flex items-center justify-center border border-slate-800/80 group">
              <img
                src={giveaway.image}
                alt={giveaway.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-card via-transparent to-transparent opacity-80" />

              {/* Status Overlay */}
              {giveaway.status === 'ENDED' ? (
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-600/80 text-rose-300 text-xs font-bold uppercase tracking-wider">
                  Event Concluded
                </div>
              ) : (
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian/90 backdrop-blur-md border border-slate-700 text-xs text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Provably Fair RNG Audited</span>
                </div>
              )}
            </div>

            {/* Title & Description */}
            <div className="mt-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {giveaway.title}
              </h1>
              <p className="text-sm text-slate-400 mt-1.5">
                {giveaway.subtitle}
              </p>
              <p className="text-sm text-slate-300 mt-4 leading-relaxed bg-obsidian/50 p-4 rounded-xl border border-slate-800/80">
                {giveaway.description}
              </p>
            </div>
          </div>

          {/* Specifications Table */}
          {giveaway.specifications && (
            <div className="p-6 rounded-2xl bg-deep-card border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent-purple" />
                Technical Specifications & Terms
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {giveaway.specifications.map((spec, i) => (
                  <div key={i} className="p-3 rounded-xl bg-obsidian/60 border border-slate-800/80">
                    <span className="text-xs text-slate-500 block">{spec.label}</span>
                    <span className="text-sm font-semibold text-slate-200">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Terms Checklist */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-400 block mb-2">Participation Conditions:</span>
                <ul className="space-y-1.5">
                  {giveaway.terms.map((t, idx) => (
                    <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                      <span className="text-accent-purple font-bold">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Action & Balance Verification Box */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Action Hub */}
          <div className="sticky top-24 rounded-3xl bg-deep-card border border-slate-800 p-6 md:p-7 shadow-2xl space-y-6">
            {/* Required Currency Price Tag */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Required Entry Fee
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-reward-gold tracking-tight">
                    {giveaway.cost.toLocaleString()}
                  </span>
                  <span className="text-base font-bold text-purple-300">
                    {giveaway.currency}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Your Available
                </span>
                <div className="text-base font-bold text-white mt-1">
                  {balanceCheck.available.toLocaleString()} {giveaway.currency}
                </div>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="p-4 rounded-2xl bg-obsidian/90 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-300 text-xs font-semibold">
                <Clock className="w-4 h-4 text-reward-gold animate-pulse" />
                <span>Round Closes In:</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                <span className="px-2 py-1 rounded-lg bg-deep-card border border-slate-700">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="px-2 py-1 rounded-lg bg-deep-card border border-slate-700">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="px-2 py-1 rounded-lg bg-deep-card border border-slate-700 text-reward-gold">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            {/* Pool Filling Meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-accent-purple" />
                  Spots Reserved: <strong className="text-white">{giveaway.spotsTaken}</strong> / {giveaway.totalSpots}
                </span>
                <span className="font-semibold text-purple-400">{progressPercent}% Filled</span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-obsidian border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-purple to-reward-gold rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Automated Balance Validation & Dynamic CTA */}
            <div className="space-y-3 pt-2">
              {alreadyJoined ? (
                /* Already Participating State */
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">You're Already Participating!</h4>
                  <p className="text-xs text-slate-300">
                    Your ticket is locked in this draw pool. Check the Winners Hub once the round timer concludes.
                  </p>
                  <Link
                    to="/winners"
                    className="inline-block mt-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline"
                  >
                    Go to Winners Portal →
                  </Link>
                </div>
              ) : balanceCheck.isSufficient ? (
                /* Sufficient Balance: Enable Confirmation Trigger */
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-accent-purple via-purple-600 to-accent-purple hover:opacity-95 transition-all shadow-[0_10px_25px_-5px_rgba(124,58,237,0.5)] flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-5 h-5 text-reward-gold group-hover:rotate-12 transition-transform" />
                  <span>Join Giveaway Now</span>
                  <span className="text-xs opacity-80 font-normal">({giveaway.cost} {giveaway.currency})</span>
                </button>
              ) : (
                /* Insufficient Balance: Transform CTA to 'Earn More [Currency]' with exact deficit calculation */
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold text-rose-300">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Balance Deficit Detected</span>
                    </div>
                    <p className="text-slate-300">
                      You need <strong className="text-rose-400">{balanceCheck.deficit.toLocaleString()} more {giveaway.currency}</strong> to enter this pool.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      alert(`To earn more ${giveaway.currency}, complete platform check-ins, refer friends, or unlock daily staking rewards.`);
                    }}
                    className="w-full py-3.5 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-600 to-reward-gold hover:opacity-95 transition shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2"
                  >
                    <span>Earn More {giveaway.currency}</span>
                    <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">
                      +{balanceCheck.deficit} needed
                    </span>
                  </button>

                  {/* Dev / Tester Quick Top-Up Utility */}
                  <div className="pt-2 text-center">
                    <button
                      onClick={() => addFunds(giveaway.currency, giveaway.cost)}
                      className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 hover:underline cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>[Demo Test] Top up +{giveaway.cost} {giveaway.currency}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Security Guarantee */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-around text-center text-xs text-slate-400">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-accent-purple" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div className="flex flex-col items-center gap-1">
                <Award className="w-4 h-4 text-reward-gold" />
                <span>100% Genuine Items</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        giveaway={giveaway}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)}
      />
    </div>
  );
}
