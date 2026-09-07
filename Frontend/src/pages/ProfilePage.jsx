import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShieldCheck, Coins, Wallet, LogOut, LogIn, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useGiveaway } from '../context/GiveawayContext';

export default function ProfilePage() {
  const { currentUser, balances, isAuthenticated, logoutUser } = useGiveaway();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12 pb-24 md:pb-12 space-y-6">
      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-6 space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Member Profile
        </h1>
        <p className="text-xs text-slate-400">
          Manage your VELOOP Rewards account and on-chain token assets.
        </p>
      </div>

      {isAuthenticated && currentUser ? (
        <div className="space-y-6">
          {/* User Card */}
          <div className="rounded-3xl bg-[#13131a] border border-white/8 p-6 space-y-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {(currentUser.name || 'U').slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white truncate">{currentUser.name || 'Alex Mercer'}</h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <ShieldCheck className="w-3 h-3" /> KYC Verified
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{currentUser.email || 'alex.mercer@veloop.io'}</p>
                <div className="text-[11px] font-mono text-purple-400 mt-1">
                  ID: {currentUser.customUserId || 'VE10025'}
                </div>
              </div>
            </div>

            {/* Balances Section */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-purple-400" />
                <span>Token Balances</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#09090b] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>VEs Balance</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono">
                    {(balances.VES ?? balances.VEs ?? 0).toLocaleString()}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#09090b] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400">
                    <Coins className="w-3.5 h-3.5" />
                    <span>SVEs Balance</span>
                  </div>
                  <div className="text-lg font-bold text-amber-300 font-mono">
                    {(balances.SVES ?? balances.SVEs ?? 0).toLocaleString()}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-[#09090b] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-cyan-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tokens</span>
                  </div>
                  <div className="text-lg font-bold text-cyan-300 font-mono">
                    {(balances.Tokens ?? 3000).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Logout */}
            <div className="pt-2">
              <button
                onClick={logoutUser}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 font-medium text-xs transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of VELOOP</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Unauthenticated Prompt */
        <div className="rounded-3xl bg-[#13131a] border border-white/8 p-10 text-center space-y-5 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Join the Community</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Log in to track your provably fair tickets, view live token balances, and claim won giveaways.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1f1f2e] border border-white/10 hover:border-white/20 text-white text-xs font-semibold transition"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white text-xs font-bold shadow-lg shadow-purple-900/30 hover:opacity-95 transition"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
