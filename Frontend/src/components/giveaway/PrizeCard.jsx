import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock, CheckCircle2, Zap, ArrowRight, Users, Loader2,
  Shield, TrendingUp, Award
} from 'lucide-react';
import { useGiveaway } from '../../context/GiveawayContext';

/* ─── Card Theme ─────────────────────────────────────────────── */
function getCardTheme(giveaway) {
  const title    = (giveaway.title    || '').toLowerCase();
  const category = (giveaway.category || '').toLowerCase();
  const currency = (giveaway.currency || '').toLowerCase();

  if (title.includes('amazon') || title.includes('voucher')) {
    return {
      outerBorder: 'border-amber-500/30',
      outerGlow:   'hover:shadow-[0_24px_60px_-12px_rgba(245,158,11,0.4)]',
      imageBg:     'bg-[#100b01]',
      radialGlow:  'bg-[radial-gradient(ellipse_90%_70%_at_50%_10%,rgba(200,110,0,0.45)_0%,rgba(130,60,0,0.18)_55%,transparent_100%)]',
      imageBorder: 'border-amber-500/25',
      badgeLabel:  'HOT',
      badgeCls:    'bg-orange-500 text-white',
      pillCls:     'bg-black/50 border border-amber-400/25 text-amber-200/90 backdrop-blur-md',
      progressFill:'from-amber-500 to-orange-500',
      timerColor:  'text-amber-300',
      accentText:  'text-amber-400',
      glowBar:     'from-amber-500/0 via-amber-400/60 to-amber-500/0',
    };
  }
  if (title.includes('iphone') || category.includes('flagship')) {
    return {
      outerBorder: 'border-purple-500/35',
      outerGlow:   'hover:shadow-[0_24px_60px_-12px_rgba(124,58,237,0.5)]',
      imageBg:     'bg-[#0d0318]',
      radialGlow:  'bg-[radial-gradient(ellipse_90%_70%_at_50%_10%,rgba(130,30,240,0.5)_0%,rgba(70,10,140,0.22)_55%,transparent_100%)]',
      imageBorder: 'border-purple-500/35',
      badgeLabel:  'GRAND',
      badgeCls:    'bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
      pillCls:     'bg-black/50 border border-purple-400/25 text-purple-200/90 backdrop-blur-md',
      progressFill:'from-violet-500 to-purple-600',
      timerColor:  'text-purple-300',
      accentText:  'text-purple-400',
      glowBar:     'from-purple-500/0 via-purple-400/60 to-purple-500/0',
    };
  }
  if (title.includes('watch') || title.includes('airpods') || category.includes('wearable') || category.includes('audio')) {
    return {
      outerBorder: 'border-cyan-500/30',
      outerGlow:   'hover:shadow-[0_24px_60px_-12px_rgba(6,182,212,0.4)]',
      imageBg:     'bg-[#010d1f]',
      radialGlow:  'bg-[radial-gradient(ellipse_90%_70%_at_50%_10%,rgba(0,110,220,0.45)_0%,rgba(0,55,130,0.2)_55%,transparent_100%)]',
      imageBorder: 'border-cyan-500/25',
      badgeLabel:  'TRENDING',
      badgeCls:    'bg-fuchsia-600 text-white',
      pillCls:     'bg-black/50 border border-cyan-400/25 text-cyan-200/90 backdrop-blur-md',
      progressFill:'from-cyan-500 to-blue-500',
      timerColor:  'text-cyan-300',
      accentText:  'text-cyan-400',
      glowBar:     'from-cyan-500/0 via-cyan-400/60 to-cyan-500/0',
    };
  }
  if (title.includes('recharge') || currency === 'tokens') {
    return {
      outerBorder: 'border-teal-500/30',
      outerGlow:   'hover:shadow-[0_24px_60px_-12px_rgba(20,184,166,0.4)]',
      imageBg:     'bg-[#010e10]',
      radialGlow:  'bg-[radial-gradient(ellipse_90%_70%_at_50%_10%,rgba(0,150,130,0.45)_0%,rgba(0,80,70,0.2)_55%,transparent_100%)]',
      imageBorder: 'border-teal-500/25',
      badgeLabel:  'FAST DRAW',
      badgeCls:    'bg-emerald-600 text-white',
      pillCls:     'bg-black/50 border border-teal-400/25 text-teal-200/90 backdrop-blur-md',
      progressFill:'from-teal-500 to-emerald-500',
      timerColor:  'text-teal-300',
      accentText:  'text-teal-400',
      glowBar:     'from-teal-500/0 via-teal-400/60 to-teal-500/0',
    };
  }
  return {
    outerBorder: 'border-violet-500/30',
    outerGlow:   'hover:shadow-[0_24px_60px_-12px_rgba(124,58,237,0.4)]',
    imageBg:     'bg-[#0c0520]',
    radialGlow:  'bg-[radial-gradient(ellipse_90%_70%_at_50%_10%,rgba(110,30,210,0.45)_0%,rgba(60,10,140,0.2)_55%,transparent_100%)]',
    imageBorder: 'border-violet-500/25',
    badgeLabel:  'NEW',
    badgeCls:    'bg-violet-600 text-white',
    pillCls:     'bg-black/50 border border-violet-400/25 text-violet-200/90 backdrop-blur-md',
    progressFill:'from-violet-500 to-purple-600',
    timerColor:  'text-violet-300',
    accentText:  'text-violet-400',
    glowBar:     'from-violet-500/0 via-violet-400/60 to-violet-500/0',
  };
}

/* ─── Countdown Hook ─────────────────────────────────────────── */
function useCountdown(endsAt) {
  const calc = () => {
    const diff = new Date(endsAt) - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, expired: true };
    const s = Math.floor(diff / 1000);
    return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60, expired: false };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  return time;
}

function fmt(n) {
  if (!n && n !== 0) return '0';
  if (n >= 1000) { const k = n / 1000; return `${Number.isInteger(k) ? k : k.toFixed(1)}K`; }
  return n.toLocaleString();
}

const pad = (n) => String(n).padStart(2, '0');

/* ─── Prize Card ─────────────────────────────────────────────── */
export default function PrizeCard({ giveaway }) {
  const navigate = useNavigate();
  const { hasJoined, getBalanceCheck, joiningGiveawayId } = useGiveaway();

  const isJoined     = hasJoined(giveaway.id);
  const isProcessing = joiningGiveawayId === giveaway.id;
  const theme        = getCardTheme(giveaway);
  const countdown    = useCountdown(giveaway.endsAt);
  const isEnded      = giveaway.status === 'ENDED' || countdown.expired;

  const currentEntries = Number(giveaway.currentEntries ?? giveaway.spotsTaken ?? 0);
  const maxEntries     = Number(giveaway.maxEntries ?? giveaway.totalSpots ?? 1000);
  const percentFilled  = maxEntries > 0 ? Math.min(100, Math.round((currentEntries / maxEntries) * 100)) : 0;
  const spotsLeft      = Math.max(0, maxEntries - currentEntries);
  const isFilling      = percentFilled >= 70;
  const winnerCount    = giveaway.prizes?.[0]?.winnerCount || 1;
  const odds = currentEntries > 0
    ? `1 in ${Math.ceil(currentEntries / winnerCount).toLocaleString()}`
    : `1 in ${Math.ceil(maxEntries / winnerCount).toLocaleString()}`;

  const handleCardClick   = () => navigate(`/giveaway/${giveaway.slug || giveaway.id || giveaway._id}`);
  const handleActionClick = (e) => { e.stopPropagation(); handleCardClick(); };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={handleCardClick}
      className={`group relative flex flex-col rounded-2xl bg-[#0f1117] border ${theme.outerBorder} ${theme.outerGlow}
        shadow-lg hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer select-none h-full`}
    >
      {/* Animated top glow bar */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${theme.glowBar} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* ── IMAGE ZONE ── */}
      <div className={`relative w-full h-44 overflow-hidden border-b ${theme.imageBorder} flex-shrink-0`}>
        <div className={`absolute inset-0 ${theme.imageBg}`} />
        <div className={`absolute inset-0 ${theme.radialGlow}`} />
        <img
          src={giveaway.image}
          alt={giveaway.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            const t = (giveaway.title || '').toLowerCase();
            if (t.includes('iphone'))                          e.currentTarget.src = '/assets/iphone-prize.jpg';
            else if (t.includes('watch'))                      e.currentTarget.src = '/assets/apple-watch.jpg';
            else if (t.includes('airpods'))                    e.currentTarget.src = '/assets/airpods.jpg';
            else if (t.includes('2000') || t.includes('2,000')) e.currentTarget.src = '/assets/amazon-2000.jpg';
            else if (t.includes('500'))                        e.currentTarget.src = '/assets/amazon-500.png';
            else if (t.includes('20') || t.includes('recharge')) e.currentTarget.src = '/assets/recharge-voucher.png';
            else                                               e.currentTarget.src = '/assets/recharge-voucher.png';
          }}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-[#0f1117]/20 to-transparent" />

        {/* Top row */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest shadow-md ${isEnded ? 'bg-slate-700 text-slate-300 border border-slate-600' : theme.badgeCls}`}>
            {isEnded ? 'ENDED' : theme.badgeLabel}
          </span>
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold ${theme.pillCls}`}>
            <Users className="w-2.5 h-2.5" />
            {fmt(currentEntries)} Joined
          </span>
        </div>

        {/* Retail price */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-amber-300 font-mono tracking-wide">
            {giveaway.retailPrice}
          </span>
        </div>

        {/* Spots left warning */}
        {isFilling && !isEnded && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-[9px] font-bold text-rose-300 backdrop-blur-md">
              <TrendingUp className="w-2.5 h-2.5" />
              {fmt(spotsLeft)} spots left
            </span>
          </div>
        )}
      </div>

      {/* ── CARD BODY — justify-between pushes CTA to bottom ── */}
      <div className="flex flex-col flex-1 px-4 pt-3 pb-4 justify-between gap-2">

        {/* TOP: title + countdown + info strip */}
        <div className="flex flex-col gap-2">

          {/* Title — always 2 lines tall via min-h */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors leading-snug flex-1 line-clamp-2 min-h-[2.5rem]">
              {giveaway.title}
            </h3>
            <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border border-white/10 bg-white/5 ${theme.accentText}`}>
              {giveaway.retailPrice}
            </span>
          </div>

          {/* Countdown — fixed single line h-4 */}
          <div className="h-4 flex items-center">
            {!isEnded ? (
              <div className={`flex items-center gap-1.5 text-[11px] font-medium ${theme.timerColor}`}>
                <Clock className="w-3 h-3 shrink-0" />
                <span className="font-mono tracking-wide">
                  {countdown.d > 0
                    ? `${countdown.d}d : ${pad(countdown.h)}h : ${pad(countdown.m)}m`
                    : `${pad(countdown.h)}h : ${pad(countdown.m)}m : ${pad(countdown.s)}s`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                ENDED — Draw Concluded
              </div>
            )}
          </div>

          {/* Info strip — NO flex-wrap, single fixed line */}
          <div className="flex items-center gap-2 overflow-hidden">
            <span className={`flex items-center gap-1 text-[10px] font-semibold shrink-0 ${theme.accentText}`}>
              <Award className="w-2.5 h-2.5 shrink-0" />
              {odds}
            </span>
            <span className="text-white/20 text-[10px] shrink-0">·</span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 shrink-0">
              <Shield className="w-2.5 h-2.5 shrink-0" />
              {winnerCount} prize{winnerCount > 1 ? 's' : ''}
            </span>
            <span className="text-white/20 text-[10px] shrink-0">·</span>
            <span className={`flex items-center gap-1 text-[10px] font-semibold shrink-0 ${isFilling ? 'text-rose-400' : 'text-slate-400'}`}>
              <TrendingUp className="w-2.5 h-2.5 shrink-0" />
              {isFilling ? `${fmt(spotsLeft)} left` : `${fmt(maxEntries)} spots`}
            </span>
          </div>
        </div>

        {/* BOTTOM: progress + cost + CTA */}
        <div className="flex flex-col gap-2">

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400 font-medium">{currentEntries} / {maxEntries} Entries</span>
              <span className={`font-bold ${isFilling ? 'text-rose-400' : theme.accentText}`}>{percentFilled}%</span>
            </div>
            <div className="relative w-full h-1.5 rounded-full bg-white/8 overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${isFilling ? 'from-rose-500 to-orange-500' : theme.progressFill}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentFilled}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              <div
                className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2.5s_infinite]"
                style={{ left: `${Math.max(0, percentFilled - 8)}%` }}
              />
            </div>
          </div>

          {/* Entry cost */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Entry Cost</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-amber-400 tracking-tight">
                {(giveaway.entryFee ?? giveaway.cost ?? 0).toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-purple-400">{giveaway.currency}</span>
            </div>
          </div>

          {/* CTA Button */}
          {isEnded ? (
            <button type="button" onClick={handleActionClick}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm font-semibold hover:bg-white/10 active:scale-95 transition-all cursor-pointer">
              <Clock className="w-4 h-4 text-slate-500" />
              Event Concluded
            </button>
          ) : isJoined ? (
            <button type="button" onClick={handleActionClick}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm font-bold hover:bg-emerald-500/25 active:scale-95 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              You're In ✓ — View Ticket
            </button>
          ) : isProcessing ? (
            <button type="button" disabled
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold cursor-not-allowed opacity-80">
              <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
              Joining...
            </button>
          ) : (
            <button type="button" onClick={handleActionClick}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                text-sm font-bold text-white tracking-wide
                bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#a855f7]
                hover:from-[#4F46E5] hover:to-[#6D28D9]
                shadow-[0_0_20px_rgba(124,58,237,0.5)]
                hover:shadow-[0_0_30px_rgba(124,58,237,0.8)]
                active:scale-95 transition-all duration-200 cursor-pointer">
              <Zap className="w-4 h-4 text-amber-300" />
              Join for {(giveaway.entryFee ?? giveaway.cost ?? 0).toLocaleString()} {giveaway.currency}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
