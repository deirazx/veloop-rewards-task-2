import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Menu, X, Gift, User, LogOut, LogIn, UserPlus, Coins, Zap } from 'lucide-react';
import { useGiveaway } from '../../context/GiveawayContext';

export default function Navbar() {
  const { balances, currentUser, logoutUser, isAuthenticated } = useGiveaway();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Discover',     path: '/' },
    { label: 'Winners',      path: '/winners' },
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

        {/* ── Right side ── */}
        <div className="flex items-center gap-2.5">
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
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#13131a] border border-white/8">
                <div className="w-6 h-6 rounded-full bg-purple-500/25 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-purple-300" />
                </div>
                <div className="hidden sm:block leading-none">
                  <div className="text-xs font-bold text-white font-mono">
                    {currentUser.customUserId || 'VE10025'}
                  </div>
                  <div className="text-[9px] text-emerald-400">Verified</div>
                </div>
              </div>

              <button
                onClick={logoutUser}
                className="p-2.5 rounded-xl bg-[#13131a] border border-white/8 text-slate-400 hover:text-rose-400 hover:border-rose-500/20 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button className="hidden md:flex p-2.5 rounded-xl text-slate-400 hover:text-white transition">
                <Bell className="w-5 h-5" strokeWidth={1.5} />
              </button>

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

              {/* Mobile hamburger */}
              <button
                className="sm:hidden p-2.5 rounded-xl text-slate-400 hover:text-white border border-white/8 transition"
                onClick={() => setMenuOpen((v) => !v)}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/5 bg-[#09090b] px-4 py-4 flex flex-col gap-2">
          {navLinks.map(({ label, path }) => (
            <Link key={path} to={path} className="text-sm text-slate-300 hover:text-white py-2 border-b border-white/5" onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Link to="/login" className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium border border-white/10 text-slate-300" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#a855f7]" onClick={() => setMenuOpen(false)}>Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  );
}
