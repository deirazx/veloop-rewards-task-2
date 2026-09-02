import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, ArrowRight, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useGiveaway } from '../../context/GiveawayContext';

export default function PrizeCard({ giveaway }) {
  const navigate = useNavigate();
  const { hasJoined, getBalanceCheck } = useGiveaway();

  const isJoined = hasJoined(giveaway.id);
  const balanceCheck = getBalanceCheck(giveaway.cost, giveaway.currency);
  const percentFilled = Math.round((giveaway.spotsTaken / giveaway.totalSpots) * 100);

  const handleCardClick = () => {
    navigate(`/giveaway/${giveaway.slug}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between rounded-3xl bg-deep-card border border-slate-800/90 hover:border-accent-purple/50 shadow-xl hover:shadow-[0_15px_30px_-10px_rgba(124,58,237,0.25)] transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Top Banner Tag */}
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent-purple/20 text-purple-300 border border-accent-purple/30">
            {giveaway.category}
          </span>
          <span className="text-xs font-mono font-bold text-slate-400">
            {giveaway.retailPrice}
          </span>
        </div>

        {/* Prize Image */}
        <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-obsidian border border-slate-800/80">
          <img
            src={giveaway.image}
            alt={giveaway.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-card via-transparent to-transparent opacity-80" />

          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-1 rounded-lg bg-obsidian/85 backdrop-blur-md border border-slate-700/80 text-[10px] font-semibold text-slate-200">
              {giveaway.type === 'PHYSICAL' ? '📦 Physical Prize' : '⚡ Digital E-Voucher'}
            </span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="mt-4">
          <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
            {giveaway.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {giveaway.subtitle}
          </p>
        </div>
      </div>

      {/* Progress & Entry Price Block */}
      <div className="p-5 pt-4 space-y-4">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Spots: <strong className="text-slate-200">{giveaway.spotsTaken}</strong>/{giveaway.totalSpots}</span>
            <span className="font-semibold text-purple-300">{percentFilled}% Full</span>
          </div>
          <div className="w-full h-2 rounded-full bg-obsidian border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-purple to-reward-gold rounded-full"
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>

        {/* Pricing Breakdown & Dynamic CTA */}
        <div className="pt-3 border-t border-slate-800/90 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
              Entry Cost
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-extrabold text-reward-gold tracking-tight">
                {giveaway.cost.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-purple-300">
                {giveaway.currency}
              </span>
            </div>
          </div>

          {/* Action Button */}
          {isJoined ? (
            <span className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Joined</span>
            </span>
          ) : !balanceCheck.isSufficient ? (
            <span className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1">
              <span>View Deficit</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/giveaway/${giveaway.slug}`);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-accent-purple hover:bg-purple-600 transition shadow-lg shadow-purple-950/40 flex items-center gap-1.5 group-hover:scale-105"
            >
              <span>Join Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
