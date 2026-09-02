import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gift, Coins, ShieldCheck, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useGiveaway } from '../../context/GiveawayContext';

export default function Navbar() {
  const { balances, currentUser, logoutUser, isAuthenticated } = useGiveaway();
  const location = useLocation();

  const navLinks = [
    { name: 'Discover Giveaways', path: '/' },
    { name: 'Winners & Claims', path: '/winners' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-obsidian/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent-purple to-reward-gold p-0.5 shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <div className="w-full h-full bg-deep-card rounded-[14px] flex items-center justify-center">
                <Gift className="w-5 h-5 text-reward-gold group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                VELOOP <span className="text-xs px-1.5 py-0.5 rounded-md bg-accent-purple/30 text-purple-300 font-mono font-bold">REWARDS</span>
              </span>
              <span className="text-[10px] text-slate-400 block tracking-wider font-mono">
                CRYPTO &amp; HARDWARE POOLS
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-deep-card text-white border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Auth State or Visitor Actions */}
        <div className="flex items-center gap-2.5 md:gap-4">
          {isAuthenticated && currentUser ? (
            <>
              {/* Balance Pills Container */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-deep-card/90 border border-slate-800">
                {/* VEs Balance Pill */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-obsidian border border-slate-800/80">
                  <span className="w-2 h-2 rounded-full bg-accent-purple" />
                  <span className="text-[11px] font-mono text-slate-400">VEs:</span>
                  <span className="text-xs font-bold text-white font-mono">
                    {(balances.VES ?? balances.VEs ?? 0).toLocaleString()}
                  </span>
                </div>

                {/* SVEs Balance Pill */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-obsidian border border-slate-800/80">
                  <span className="w-2 h-2 rounded-full bg-reward-gold shadow-[0_0_8px_#F59E0B]" />
                  <span className="text-[11px] font-mono text-slate-400">SVEs:</span>
                  <span className="text-xs font-bold text-reward-gold font-mono">
                    {(balances.SVES ?? balances.SVEs ?? 0).toLocaleString()}
                  </span>
                </div>

                {/* Tokens Balance Pill */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-obsidian border border-slate-800/80">
                  <Coins className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[11px] font-mono text-slate-400">Tokens:</span>
                  <span className="text-xs font-bold text-blue-300 font-mono">
                    {(balances.Tokens ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* User Profile Avatar / ID */}
              <div className="flex items-center gap-2.5 pl-1">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-deep-card border border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-accent-purple/30 border border-purple-500/40 flex items-center justify-center text-purple-300 text-xs font-mono font-bold">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white font-mono leading-none">
                      {currentUser.customUserId || 'VE10025'}
                    </div>
                    <span className="text-[9px] text-emerald-400 font-medium">
                      Verified
                    </span>
                  </div>
                </div>

                <button
                  onClick={logoutUser}
                  title="Log out of wallet"
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 hover:border-rose-900/40 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            /* Unauthenticated Visitor State (STAGE 1 Requirement) */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-accent-purple to-purple-600 hover:from-purple-600 hover:to-accent-purple transition shadow-md shadow-purple-950/40 flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
