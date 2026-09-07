import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Menu,
  X,
  Gift,
  User,
  LogOut,
  LogIn,
  Coins,
  Zap,
  Trophy,
  Ticket,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useGiveaway } from '../../context/GiveawayContext';

export default function Navbar() {
  const { balances, currentUser, logoutUser, isAuthenticated } = useGiveaway();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setBellOpen(false);
  }, [location.pathname]);

  const notifications = [
    { id: 1, title: 'iPhone 15 Pro Draw', desc: 'Pool closing in 2 hours! 1 ticket active.', time: '10m ago' },
    { id: 2, title: 'Recent Winner Alert', desc: 'Rohit Sharma won ₹5,000 Amazon Gift Card!', time: '1h ago' },
    { id: 3, title: 'Welcome Bonus', desc: '1,000 VEs credited to your test wallet.', time: '2h ago' },
  ];

  const navLinks = [
    { label: 'Discover', path: '/' },
    { label: 'Winners', path: '/winners' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#09090b]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#a855f7] p-[2px] shadow-[0_0_16px_rgba(168,85,247,0.45)] group-hover:shadow-[0_0_24px_rgba(168,85,247,0.65)] transition-shadow">
            <div className="w-full h-full bg-[#09090b] rounded-full flex items-center justify-center">
              <Gift className="w-4 h-4 text-[#a855f7]" />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-wide text-white">VELOOP</span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#a855f7]">REWARDS</span>
          </div>
        </Link>

        {/* ── Desktop nav links ── */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                location.pathname === path
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* ── Right side controls ── */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => {
                setBellOpen((v) => !v);
                setMenuOpen(false);
              }}
              className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-white transition relative cursor-pointer border border-transparent hover:border-white/10"
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#a855f7] animate-pulse" />
            </button>

            {bellOpen && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#13131a] border border-white/10 shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-[#a855f7]" /> Notifications
                  </span>
                  <button
                    onClick={() => setBellOpen(false)}
                    className="text-[10px] text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-[#09090b] border border-white/5 space-y-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{n.title}</span>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Authenticated View */}
          {isAuthenticated && currentUser ? (
            <>
              {/* Balance strip */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#13131a] border border-white/8">
                <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                <span className="text-[11px] font-mono text-slate-400">VEs:</span>
                <span className="text-xs font-bold text-white font-mono">
                  {(balances.VES ?? balances.VEs ?? 0).toLocaleString()}
                </span>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <Coins className="w-3 h-3 text-amber-400" />
                <span className="text-[11px] font-mono text-slate-400">SVEs:</span>
                <span className="text-xs font-bold text-amber-300 font-mono">
                  {(balances.SVES ?? balances.SVEs ?? 0).toLocaleString()}
                </span>
              </div>

              {/* User chip */}
              <Link to="/profile" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#13131a] border border-white/8 hover:border-purple-500/30 transition">
                <div className="w-6 h-6 rounded-full bg-purple-500/25 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-purple-300" />
                </div>
                <div className="leading-none">
                  <div className="text-xs font-bold text-white font-mono">
                    {currentUser.customUserId || 'VE10025'}
                  </div>
                  <div className="text-[9px] text-emerald-400">Verified</div>
                </div>
              </Link>

              <button
                onClick={logoutUser}
                className="hidden sm:flex p-2.5 rounded-xl bg-[#13131a] border border-white/8 text-slate-400 hover:text-rose-400 hover:border-rose-500/20 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* Desktop Unauthenticated CTAs */
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white border border-white/8 hover:border-white/15 bg-[#13131a] transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white
                  bg-gradient-to-r from-[#6366F1] to-[#a855f7]
                  shadow-[0_0_16px_rgba(168,85,247,0.35)]
                  hover:shadow-[0_0_24px_rgba(168,85,247,0.55)]
                  hover:from-[#4F46E5] hover:to-[#9333ea]
                  transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            className={`md:hidden p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
              menuOpen
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                : 'text-slate-300 hover:text-white border-white/10 bg-[#13131a]/80'
            }`}
            onClick={() => {
              setMenuOpen((v) => !v);
              setBellOpen(false);
            }}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Ultra-Premium Mobile Dropdown Overlay & Drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 top-16 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Slide-down Drawer Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed top-16 left-0 right-0 z-50 md:hidden bg-[#0c0c14]/98 backdrop-blur-2xl border-b border-purple-500/25 shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[calc(100vh-4.5rem)] overflow-y-auto px-4 py-5 space-y-4"
            >
              {/* Top ambient glowing accent line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

              {/* 1. Authenticated User Card & Live Balances */}
              {isAuthenticated && currentUser ? (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1b172a] via-[#13131e] to-[#0c0c12] border border-purple-500/30 shadow-[0_8px_32px_rgba(124,58,237,0.18)] space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 p-[2px] shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                          <div className="w-full h-full rounded-full bg-[#09090b] flex items-center justify-center">
                            <User className="w-5 h-5 text-purple-300" />
                          </div>
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#09090b]" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                          {currentUser.customUserId || 'VE10025'}
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                            Verified
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {currentUser.email || 'Member ID Active'}
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 text-[11px] font-semibold text-purple-300 border border-white/10 flex items-center gap-1 transition"
                    >
                      Profile <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* 2-Column Balance Hub */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {/* VEs Pill */}
                    <div className="p-2.5 rounded-xl bg-[#09090f]/80 border border-purple-500/20 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-[10px] font-mono uppercase tracking-wider">VEs Points</span>
                      </div>
                      <span className="text-base font-bold text-white font-mono tracking-tight">
                        {(balances.VES ?? balances.VEs ?? 0).toLocaleString()}
                      </span>
                    </div>

                    {/* SVEs Pill */}
                    <div className="p-2.5 rounded-xl bg-[#09090f]/80 border border-amber-500/20 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[10px] font-mono uppercase tracking-wider">SVEs Coins</span>
                      </div>
                      <span className="text-base font-bold text-amber-300 font-mono tracking-tight">
                        {(balances.SVES ?? balances.SVEs ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* 2. Unauthenticated Welcome Card & CTAs */
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-[#13131e] to-[#09090b] border border-purple-500/20 space-y-3">
                  <div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-[10px] font-bold text-purple-300 mb-1.5">
                      <Sparkles className="w-3 h-3 text-purple-400" /> Exclusive Rewards
                    </div>
                    <h3 className="text-sm font-bold text-white">Join Veloop Rewards</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      Enter provably fair giveaways and win luxury prizes daily.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-[#1a1a24] border border-white/10 hover:border-white/20 transition active:scale-95 text-center"
                    >
                      <LogIn className="w-3.5 h-3.5 text-slate-400" />
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#a855f7] shadow-[0_0_16px_rgba(168,85,247,0.4)] hover:shadow-[0_0_22px_rgba(168,85,247,0.6)] transition active:scale-95 text-center"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}

              {/* 3. Rich Navigation Directory */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold px-1">
                  Explore Platform
                </div>

                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    location.pathname === '/'
                      ? 'bg-purple-500/15 border-purple-500/35 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                      : 'bg-[#13131a]/70 hover:bg-[#13131a] border-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        Active Giveaways
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                          LIVE
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">High-value electronics, cash & supercars</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>

                <Link
                  to="/winners"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    location.pathname === '/winners'
                      ? 'bg-purple-500/15 border-purple-500/35 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                      : 'bg-[#13131a]/70 hover:bg-[#13131a] border-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        Winners & Draws
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
                          Audited
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">Verified winners and live leaderboard</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>

                <Link
                  to="/entries"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    location.pathname === '/entries'
                      ? 'bg-purple-500/15 border-purple-500/35 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                      : 'bg-[#13131a]/70 hover:bg-[#13131a] border-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">My Entries & Tickets</div>
                      <div className="text-[10px] text-slate-400">Track active entries and win odds</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    location.pathname === '/profile'
                      ? 'bg-purple-500/15 border-purple-500/35 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                      : 'bg-[#13131a]/70 hover:bg-[#13131a] border-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Member Profile & Wallet</div>
                      <div className="text-[10px] text-slate-400">Account settings and transaction history</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>
              </div>

              {/* 4. Authenticated: Sign Out button */}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logoutUser();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition active:scale-[0.98] cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out of Account
                </button>
              )}

              {/* 5. Trust Footer */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>100% Provably Fair &bull; Audited Draws</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
