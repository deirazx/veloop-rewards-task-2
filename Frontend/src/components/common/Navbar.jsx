import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  ShieldCheck,
  CheckCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useGiveaway } from '../../context/GiveawayContext';

export default function Navbar() {
  const { balances, currentUser, logoutUser, isAuthenticated, giveaways, joinedGiveaways } = useGiveaway();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [activeHash, setActiveHash] = useState(() => (typeof window !== 'undefined' ? window.location.hash : ''));
  const bellRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setBellOpen(false);
  }, [location.pathname]);

  // Synchronize active section with scroll & hash when on home route
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveHash('');
      return;
    }

    const syncActiveScroll = () => {
      const scrollY = window.scrollY;
      const leaderboardEl = document.getElementById('leaderboard');
      const giveawaysEl = document.getElementById('active-giveaways');

      // 140px threshold gives natural active transition while scrolling
      const leaderboardTop = leaderboardEl ? leaderboardEl.offsetTop - 140 : Infinity;
      const giveawaysTop = giveawaysEl ? giveawaysEl.offsetTop - 140 : Infinity;

      if (scrollY >= leaderboardTop) {
        setActiveHash('#leaderboard');
      } else if (scrollY >= giveawaysTop) {
        setActiveHash('#active-giveaways');
      } else {
        setActiveHash('');
      }
    };

    if (location.hash) {
      setActiveHash(location.hash);
      const targetId = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      syncActiveScroll();
    }

    window.addEventListener('scroll', syncActiveScroll, { passive: true });
    return () => window.removeEventListener('scroll', syncActiveScroll);
  }, [location.pathname]);

  // Click outside to close notification dropdown & Escape key listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setBellOpen(false);
    };
    if (bellOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [bellOpen]);

  // Read notifications state stored in localStorage for authentic website UX
  const [readIds, setReadIds] = useState(() => {
    try {
      const saved = localStorage.getItem('veloop_read_notifs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const activeGiveaways = (giveaways || []).filter((g) => g.status === 'ACTIVE');
  const endedGiveaways = (giveaways || []).filter((g) => g.status === 'ENDED' || g.status === 'ARCHIVED');

  const notifications = useMemo(() => {
    const list = [];

    // 1. Live Active Giveaways from Backend Database (Top active pools)
    activeGiveaways.slice(0, 2).forEach((g) => {
      const taken = Number(g.spotsTaken ?? g.currentEntries ?? 0);
      const total = Number(g.totalSpots ?? g.maxEntries ?? 1000);
      list.push({
        id: 'gw_live_' + (g.slug || g.id || g.giveawayId),
        type: 'GIVEAWAY',
        title: `${g.title} Live`,
        desc: `${taken} of ${total} entries taken (${Math.round((taken / (total || 1)) * 100)}%). Entry fee: ${g.cost ?? g.entryFee} ${g.currency}.`,
        time: 'Live',
        link: `/giveaway/${g.slug || g.id || g.giveawayId}`,
        icon: <Gift className="w-4 h-4 text-purple-400" />,
        iconBg: 'bg-purple-500/15 border-purple-500/30'
      });
    });

    // 2. Real User Wallet Status from Backend User Record
    if (isAuthenticated && currentUser) {
      list.push({
        id: `wallet_${currentUser.customUserId || currentUser.id || 'auth'}_${balances.VES ?? balances.VEs ?? 0}_${balances.Tokens ?? 0}`,
        type: 'WALLET',
        title: `Wallet Synced (${currentUser.customUserId || 'Member'})`,
        desc: `Live balance: ${(balances.VES ?? balances.VEs ?? 0).toLocaleString()} VEs, ${(balances.SVES ?? balances.SVEs ?? 0).toLocaleString()} SVEs & ${(balances.Tokens ?? 0).toLocaleString()} Tokens available.`,
        time: 'Live',
        link: '/profile',
        icon: <Coins className="w-4 h-4 text-amber-400" />,
        iconBg: 'bg-amber-500/15 border-amber-500/30'
      });
    } else {
      list.push({
        id: 'guest_auth_prompt',
        type: 'AUTH',
        title: 'Welcome to VELOOP Rewards',
        desc: `Sign in to access your VEs wallet and enter any of the ${activeGiveaways.length} live giveaway pools.`,
        time: 'Info',
        link: '/login',
        icon: <Zap className="w-4 h-4 text-purple-400" />,
        iconBg: 'bg-purple-500/15 border-purple-500/30'
      });
    }

    // 3. Real User Tickets / Participations from Backend
    if (isAuthenticated && currentUser && joinedGiveaways && joinedGiveaways.length > 0) {
      const enteredPools = (giveaways || []).filter(
        (g) =>
          joinedGiveaways.includes(g.id) ||
          joinedGiveaways.includes(g.giveawayId) ||
          joinedGiveaways.includes(g.slug)
      );
      const names = enteredPools.map((g) => g.title).filter(Boolean);
      const entrySummary =
        names.length > 0
          ? `Confirmed in: ${names.slice(0, 2).join(', ')}${names.length > 2 ? ` +${names.length - 2} more` : ''}. Countdown active!`
          : `You have ${joinedGiveaways.length} confirmed draw ticket(s) locked in. Good luck!`;

      list.push({
        id: `tickets_joined_${joinedGiveaways.length}_${joinedGiveaways.slice(0, 3).join('_')}`,
        type: 'TICKETS',
        title: `${joinedGiveaways.length} Active Ticket(s) in Play`,
        desc: entrySummary,
        time: 'Active',
        link: '/entries',
        icon: <Ticket className="w-4 h-4 text-cyan-400" />,
        iconBg: 'bg-cyan-500/15 border-cyan-500/30'
      });
    } else if (isAuthenticated && currentUser) {
      list.push({
        id: 'no_tickets_reminder',
        type: 'TICKETS',
        title: 'No Active Tickets Yet',
        desc: `You have 0 active draw entries. Use your ${(balances.VES ?? balances.VEs ?? 0).toLocaleString()} VEs to enter an active pool now.`,
        time: 'Tip',
        link: '/#active-giveaways',
        icon: <Ticket className="w-4 h-4 text-cyan-400" />,
        iconBg: 'bg-cyan-500/15 border-cyan-500/30'
      });
    }

    // 4. Concluded Draws from Backend (if any ended) OR Live Security Protocol
    if (endedGiveaways.length > 0) {
      const lastEnded = endedGiveaways[0];
      const topWinner = lastEnded.winners?.[0];
      const winnerDisplay = topWinner?.maskedUserId || topWinner?.customUserId || 'Audited Player';
      list.push({
        id: 'ended_draw_' + (lastEnded.slug || lastEnded.id || lastEnded.giveawayId),
        type: 'WINNER',
        title: `Draw Complete: ${lastEnded.title}`,
        desc: topWinner
          ? `Official winner: ${winnerDisplay}. Verified on SHA-256 draw seed.`
          : 'Draw concluded with cryptographic provably fair verification.',
        time: 'Concluded',
        link: '/winners',
        icon: <Trophy className="w-4 h-4 text-amber-400" />,
        iconBg: 'bg-amber-500/15 border-amber-500/30'
      });
    } else {
      list.push({
        id: 'security_fairness_protocol',
        type: 'SECURITY',
        title: 'Provably Fair Protocol Active',
        desc: `All ${activeGiveaways.length} live giveaways use deterministic SHA-256 seed hashing for transparent winner selection.`,
        time: 'Verified',
        link: '/winners',
        icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
        iconBg: 'bg-emerald-500/15 border-emerald-500/30'
      });
    }

    return list;
  }, [activeGiveaways, endedGiveaways, isAuthenticated, currentUser, balances, joinedGiveaways, giveaways]);

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  const markAsRead = (id) => {
    setReadIds((prev) => {
      const updated = Array.from(new Set([...prev, id]));
      localStorage.setItem('veloop_read_notifs', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    localStorage.setItem('veloop_read_notifs', JSON.stringify(allIds));
  };

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    setBellOpen(false);
    if (notif.link) {
      if (notif.link.startsWith('/#')) {
        const targetId = notif.link.replace('/#', '');
        if (location.pathname === '/') {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/');
          setTimeout(() => {
            const el = document.getElementById(targetId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 200);
        }
      } else {
        navigate(notif.link);
      }
    }
  };

  const navLinks = [
    { label: 'Discover', path: '/' },
    { label: 'Giveaways', path: '/#active-giveaways', targetId: 'active-giveaways' },
    { label: 'Leaderboard', path: '/#leaderboard', targetId: 'leaderboard' },
    { label: 'Winners', path: '/winners' },
    {
      label: 'My Entries',
      path: '/entries',
      badge: joinedGiveaways && joinedGiveaways.length > 0 ? joinedGiveaways.length : null
    },
  ];

  const isLinkActive = (item) => {
    if (location.pathname === '/') {
      if (item.targetId) {
        return activeHash === `#${item.targetId}`;
      }
      return (!activeHash || activeHash === '#') && item.path === '/';
    }
    return location.pathname === item.path;
  };

  const handleDesktopNavClick = (e, item) => {
    if (item.targetId) {
      if (location.pathname === '/') {
        e.preventDefault();
        setActiveHash(`#${item.targetId}`);
        window.history.pushState(null, '', `#${item.targetId}`);
        const el = document.getElementById(item.targetId);
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      } else {
        setActiveHash(`#${item.targetId}`);
      }
    } else {
      setActiveHash('');
      if (item.path === '/' && location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#09090b]/90 backdrop-blur-xl border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 lg:gap-4">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-black flex items-center justify-center border border-white/10 shadow-[0_0_16px_rgba(168,85,247,0.35)] group-hover:shadow-[0_0_24px_rgba(168,85,247,0.65)] transition-all">
            <img
              src="/logo.jpeg"
              alt="VELOOP Logo"
              onError={(e) => {
                e.currentTarget.src = '/assets/logo.jpeg';
              }}
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm sm:text-base font-extrabold tracking-wide text-white">VELOOP</span>
            <span className="text-[9px] sm:text-[10px] font-extrabold tracking-[0.22em] text-[#a855f7] mt-0.5">REWARDS</span>
          </div>
        </Link>

        {/* ── Desktop nav links ── */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navLinks.map((item) => {
            const active = isLinkActive(item);
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={(e) => handleDesktopNavClick(e, item)}
                className={`relative px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-xl text-xs lg:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 group cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-purple-500/25 to-indigo-500/20 text-white font-semibold border border-purple-500/40 shadow-[0_0_16px_rgba(168,85,247,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{item.label}</span>
                {item.badge != null && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                    {item.badge}
                  </span>
                )}
                {active && (
                  <motion.span
                    layoutId="desktop-nav-active-indicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-purple-400 via-[#a855f7] to-indigo-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Right side controls ── */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Notifications button */}
          <div className="relative" ref={bellRef}>
            <button
              onClick={() => {
                setBellOpen((v) => !v);
                setMenuOpen(false);
              }}
              className={`p-2 sm:p-2.5 rounded-xl transition-all relative cursor-pointer border ${
                bellOpen
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'text-slate-400 hover:text-white border-transparent hover:border-white/10 hover:bg-white/5'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-[#6366F1] to-[#a855f7] text-white text-[10px] font-black flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.8)] border border-white/20 animate-pulse">
                  {unreadCount}
                </span>
              ) : null}
            </button>

            <AnimatePresence>
              {bellOpen && (
                <>
                  {/* Backdrop for mobile to easily dismiss by tapping outside */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => setBellOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden"
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="fixed left-3 right-3 top-[70px] sm:top-full sm:mt-2 sm:absolute sm:left-auto sm:right-0 sm:w-96 rounded-2xl bg-[#11111a] border border-purple-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.95)] p-4 z-50 space-y-3 backdrop-blur-2xl"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                          <Bell className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <span className="text-xs font-black text-white tracking-wide uppercase">
                          Notifications
                        </span>
                        {unreadCount > 0 ? (
                          <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 border border-purple-500/40 text-[10px] font-mono font-bold text-purple-300 animate-pulse">
                            {unreadCount} New
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2">
                        {unreadCount > 0 ? (
                          <button
                            onClick={markAllAsRead}
                            className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Mark all read</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                            <CheckCheck className="w-3 h-3 text-emerald-400" /> All read
                          </span>
                        )}
                        <button
                          onClick={() => setBellOpen(false)}
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
                          title="Close"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* List of notifications */}
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-white">You're all caught up!</p>
                          <p className="text-[10px] text-slate-400">No new notifications at this moment.</p>
                        </div>
                      ) : (
                        notifications.map((n) => {
                          const isRead = readIds.includes(n.id);
                          return (
                            <div
                              key={n.id}
                              onClick={() => handleNotificationClick(n)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 group relative ${
                                isRead
                                  ? 'bg-white/[0.02] border-white/5 hover:border-white/10 opacity-75 hover:opacity-100'
                                  : 'bg-[#181826] border-purple-500/30 hover:border-purple-500/50 shadow-md'
                              }`}
                            >
                              {/* Icon badge */}
                              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${n.iconBg}`}>
                                {n.icon}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <span className={`text-xs font-bold truncate group-hover:text-purple-300 transition-colors ${isRead ? 'text-slate-300' : 'text-white'}`}>
                                    {n.title}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                                    {n.time}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                                  {n.desc}
                                </p>
                              </div>

                              {/* Action Arrow & Unread indicator */}
                              <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
                                {!isRead && (
                                  <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse" />
                                )}
                                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-[10px]">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Live Event Alerts</span>
                      </span>
                      <Link
                        to="/winners"
                        onClick={() => setBellOpen(false)}
                        className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 hover:underline"
                      >
                        <span>Winners Hub</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Authenticated View */}
          {isAuthenticated && currentUser ? (
            <>
              {/* Balance strip */}
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12121c] border border-white/10 shadow-inner">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20" title="VES Platform Points">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-pulse shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                  <span className="text-[10px] font-mono text-slate-400">VEs:</span>
                  <span className="text-xs font-bold text-white font-mono">
                    {(balances.VES ?? balances.VEs ?? 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20" title="Staked SVEs">
                  <Coins className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] font-mono text-slate-400">SVEs:</span>
                  <span className="text-xs font-bold text-amber-300 font-mono">
                    {(balances.SVES ?? balances.SVEs ?? 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20" title="Community Tokens">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span className="text-[10px] font-mono text-slate-400">Tokens:</span>
                  <span className="text-xs font-bold text-cyan-300 font-mono">
                    {(balances.Tokens ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* User chip */}
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12121c] border border-white/10 hover:border-purple-500/40 hover:bg-[#181826] transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 p-[1.5px] shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                  <div className="w-full h-full rounded-[6px] bg-[#09090b] flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-purple-300 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <div className="leading-none text-left">
                  <div className="text-xs font-bold text-white font-mono group-hover:text-purple-300 transition-colors">
                    {currentUser.customUserId || 'VE10025'}
                  </div>
                  <div className="text-[9px] font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                    Verified
                  </div>
                </div>
              </Link>

              <button
                onClick={logoutUser}
                className="hidden sm:flex p-2.5 rounded-xl bg-[#12121c] border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition cursor-pointer"
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
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-white/20 bg-[#12121c] hover:bg-[#181826] transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs lg:text-sm font-bold text-white
                  bg-gradient-to-r from-[#6366F1] to-[#a855f7]
                  shadow-[0_0_16px_rgba(168,85,247,0.35)]
                  hover:shadow-[0_0_24px_rgba(168,85,247,0.55)]
                  hover:from-[#4F46E5] hover:to-[#9333ea]
                  transition-all active:scale-[0.98]"
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
                : 'text-slate-300 hover:text-white border-white/10 bg-[#13131a]'
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

      {/* ── Ultra-Premium Mobile Dropdown Drawer (100% Solid, Non-Transparent) ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop overlay (dim background page content) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 top-16 bg-black/85 z-40 md:hidden"
            />

            {/* Slide-down Drawer Panel - Fully Opaque Solid Dark Background */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-16 left-0 right-0 z-50 md:hidden bg-[#0d0d14] border-b border-purple-500/30 shadow-[0_25px_60px_rgba(0,0,0,1)] max-h-[calc(100vh-4.5rem)] overflow-y-auto px-4 py-5 space-y-4"
            >
              {/* Top ambient glowing accent line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-80" />

              {/* 1. Authenticated User Card & Live Balances */}
              {isAuthenticated && currentUser ? (
                <div className="p-4 rounded-2xl bg-[#141422] border border-purple-500/40 shadow-lg space-y-3.5">
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
                          <span className="text-[10px] font-semibold text-emerald-400 bg-[#092617] border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
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
                      className="px-2.5 py-1.5 rounded-lg bg-[#1f1f30] hover:bg-[#28283e] text-[11px] font-semibold text-purple-300 border border-purple-500/30 flex items-center gap-1 transition"
                    >
                      Profile <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* 3-Column Balance Hub */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {/* VEs Pill */}
                    <div className="p-2 rounded-xl bg-[#09090f] border border-purple-500/30 flex flex-col justify-between">
                      <div className="flex items-center gap-1 mb-1 text-slate-400">
                        <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 truncate">VEs</span>
                      </div>
                      <span className="text-sm font-bold text-white font-mono tracking-tight truncate">
                        {(balances.VES ?? balances.VEs ?? 0).toLocaleString()}
                      </span>
                    </div>

                    {/* SVEs Pill */}
                    <div className="p-2 rounded-xl bg-[#09090f] border border-amber-500/30 flex flex-col justify-between">
                      <div className="flex items-center gap-1 mb-1 text-slate-400">
                        <Coins className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 truncate">SVEs</span>
                      </div>
                      <span className="text-sm font-bold text-amber-300 font-mono tracking-tight truncate">
                        {(balances.SVES ?? balances.SVEs ?? 0).toLocaleString()}
                      </span>
                    </div>

                    {/* Tokens Pill */}
                    <div className="p-2 rounded-xl bg-[#09090f] border border-cyan-500/30 flex flex-col justify-between">
                      <div className="flex items-center gap-1 mb-1 text-slate-400">
                        <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 truncate">Tokens</span>
                      </div>
                      <span className="text-sm font-bold text-cyan-300 font-mono tracking-tight truncate">
                        {(balances.Tokens ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* 2. Unauthenticated Welcome Card & CTAs */
                <div className="p-4 rounded-2xl bg-[#141422] border border-purple-500/30 space-y-3">
                  <div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#201833] border border-purple-500/40 text-[10px] font-bold text-purple-300 mb-1.5">
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
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-[#1b1b28] border border-white/15 hover:border-white/30 transition active:scale-95 text-center"
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

                {/* Mobile Drawer Notification Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setBellOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border transition-all bg-[#141422] hover:bg-[#19192b] border-purple-500/30 text-slate-200 hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        Notifications Center
                        {unreadCount > 0 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/40 animate-pulse">
                            {unreadCount} New
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">Live draw alerts, wallet updates & tickets</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>

                <Link
                  to="/#active-giveaways"
                  onClick={(e) => {
                    setMenuOpen(false);
                    if (location.pathname === '/') {
                      e.preventDefault();
                      setActiveHash('#active-giveaways');
                      window.history.pushState(null, '', '#active-giveaways');
                      const el = document.getElementById('active-giveaways');
                      if (el) {
                        const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    } else {
                      setActiveHash('#active-giveaways');
                    }
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isLinkActive({ targetId: 'active-giveaways' })
                      ? 'bg-[#1c1730] border-purple-500/60 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'bg-[#141422] hover:bg-[#19192b] border-white/10 text-slate-200 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#231b38] border border-purple-500/40 flex items-center justify-center text-purple-400">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        Active Giveaways
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#0a2618] text-emerald-400 border border-emerald-500/30">
                          LIVE
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">High-value electronics, cash & supercars</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>

                <Link
                  to="/#leaderboard"
                  onClick={(e) => {
                    setMenuOpen(false);
                    if (location.pathname === '/') {
                      e.preventDefault();
                      setActiveHash('#leaderboard');
                      window.history.pushState(null, '', '#leaderboard');
                      const el = document.getElementById('leaderboard');
                      if (el) {
                        const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    } else {
                      setActiveHash('#leaderboard');
                    }
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isLinkActive({ targetId: 'leaderboard' })
                      ? 'bg-[#1c1730] border-purple-500/60 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'bg-[#141422] hover:bg-[#19192b] border-white/10 text-slate-200 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#2b1f13] border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        Leaderboard Rankings
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#1b1509] text-amber-300 border border-amber-500/30">
                          LIVE 3D
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">Podium champions & points leaderboard</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>

                <Link
                  to="/winners"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    location.pathname === '/winners'
                      ? 'bg-[#1c1730] border-purple-500/60 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'bg-[#141422] hover:bg-[#19192b] border-white/10 text-slate-200 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#2a2016] border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        Winners & Draws
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#2a2213] text-amber-300 border border-amber-500/30">
                          Audited
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">Verified winners and audited draws</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>

                <Link
                  to="/entries"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    location.pathname === '/entries'
                      ? 'bg-[#1c1730] border-purple-500/60 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'bg-[#141422] hover:bg-[#19192b] border-white/10 text-slate-200 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#142629] border border-cyan-500/40 flex items-center justify-center text-cyan-400">
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
                      ? 'bg-[#1c1730] border-purple-500/60 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'bg-[#141422] hover:bg-[#19192b] border-white/10 text-slate-200 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1c1b35] border border-indigo-500/40 flex items-center justify-center text-indigo-400">
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
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#241318] hover:bg-[#2e181e] text-rose-300 border border-rose-500/30 text-xs font-semibold transition active:scale-[0.98] cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out of Account
                </button>
              )}

              {/* 5. Trust Footer */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-mono">
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
