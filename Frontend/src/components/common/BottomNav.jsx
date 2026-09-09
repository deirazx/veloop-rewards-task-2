import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Gift, Trophy, Ticket, User } from 'lucide-react';
import { useGiveaway } from '../../context/GiveawayContext';

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { joinedGiveaways } = useGiveaway();

  const scrollToGiveaways = () => {
    const target = document.getElementById('active-giveaways') || document.getElementById('active-giveaways-grid');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 450, behavior: 'smooth' });
    }
  };

  const scrollToLeaderboard = () => {
    const target = document.getElementById('leaderboard') || document.querySelector('[id*="leaderboard"]');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 900, behavior: 'smooth' });
    }
  };

  const handleGiveawaysClick = (e) => {
    if (e) e.preventDefault();
    if (pathname === '/' || pathname === '/giveaways') {
      scrollToGiveaways();
    } else {
      navigate('/');
      setTimeout(() => {
        scrollToGiveaways();
      }, 150);
    }
  };

  const handleRankingsClick = (e) => {
    if (e) e.preventDefault();
    if (pathname === '/') {
      scrollToLeaderboard();
    } else {
      navigate('/');
      setTimeout(() => {
        scrollToLeaderboard();
      }, 150);
    }
  };

  const handleHomeClick = (e) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isHomeActive = pathname === '/';
  const isGiveawaysActive = pathname === '/giveaways';
  const isEntriesActive = pathname === '/entries';
  const isProfileActive = pathname === '/profile';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0c0817]/95 backdrop-blur-2xl border-t border-purple-500/20 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] safe-area-inset-bottom">
      <div className="flex items-center justify-around px-3 py-2 max-w-lg mx-auto relative h-16">

        {/* 1. Home Tab */}
        <Link
          to="/"
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl min-w-[56px] transition-all duration-200 active:scale-95 ${
            isHomeActive
              ? 'text-[#c084fc]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${isHomeActive ? 'bg-purple-500/20 text-[#c084fc] shadow-[0_0_12px_rgba(168,85,247,0.4)]' : ''}`}>
            <Home className="w-5 h-5" strokeWidth={isHomeActive ? 2.3 : 1.7} />
          </div>
          <span className="text-[10px] font-semibold tracking-tight leading-none">Home</span>
        </Link>

        {/* 2. Giveaways Tab (Direct Smooth Scroll & Navigation) */}
        <button
          type="button"
          onClick={handleGiveawaysClick}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl min-w-[56px] transition-all duration-200 active:scale-95 cursor-pointer ${
            isGiveawaysActive
              ? 'text-[#c084fc]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${isGiveawaysActive ? 'bg-purple-500/20 text-[#c084fc] shadow-[0_0_12px_rgba(168,85,247,0.4)]' : ''}`}>
            <Gift className="w-5 h-5" strokeWidth={isGiveawaysActive ? 2.3 : 1.7} />
          </div>
          <span className="text-[10px] font-semibold tracking-tight leading-none">Giveaways</span>
        </button>

        {/* 3. Center Floating Luxury Trophy / Rankings CTA */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            type="button"
            onClick={handleRankingsClick}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-amber-400 via-purple-600 to-[#ec4899]
              p-[2px] shadow-[0_0_25px_rgba(245,158,11,0.5)]
              hover:shadow-[0_0_35px_rgba(245,158,11,0.8)]
              active:scale-90 transition-all duration-150 cursor-pointer group"
            aria-label="View Leaderboard & Rankings"
            title="View Leaderboard & Rankings"
          >
            <div className="w-full h-full rounded-full bg-[#0e0a1c] flex items-center justify-center group-hover:bg-[#18112e] transition-colors relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent opacity-60" />
              <Trophy className="w-6 h-6 text-amber-300 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] relative z-10" />
            </div>
          </button>
          <span className="text-[9px] font-extrabold tracking-wider text-amber-300 mt-1 uppercase">Rankings</span>
        </div>

        {/* 4. My Entries Tab */}
        <Link
          to="/entries"
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl min-w-[56px] transition-all duration-200 active:scale-95 relative ${
            isEntriesActive
              ? 'text-[#c084fc]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all relative ${isEntriesActive ? 'bg-purple-500/20 text-[#c084fc] shadow-[0_0_12px_rgba(168,85,247,0.4)]' : ''}`}>
            <Ticket className="w-5 h-5" strokeWidth={isEntriesActive ? 2.3 : 1.7} />
            {joinedGiveaways && joinedGiveaways.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 text-black text-[9px] font-black flex items-center justify-center">
                {joinedGiveaways.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight leading-none">My Entries</span>
        </Link>

        {/* 5. Profile Tab */}
        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl min-w-[56px] transition-all duration-200 active:scale-95 ${
            isProfileActive
              ? 'text-[#c084fc]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${isProfileActive ? 'bg-purple-500/20 text-[#c084fc] shadow-[0_0_12px_rgba(168,85,247,0.4)]' : ''}`}>
            <User className="w-5 h-5" strokeWidth={isProfileActive ? 2.3 : 1.7} />
          </div>
          <span className="text-[10px] font-semibold tracking-tight leading-none">Profile</span>
        </Link>

      </div>
    </nav>
  );
}
