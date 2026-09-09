import React, { useState, useEffect } from 'react';
import { Gift, Users, Trophy, Clock } from 'lucide-react';
import { useGiveaway } from '../../context/GiveawayContext';
import api from '../../services/api';

const pad = (n) => String(n).padStart(2, '0');

export default function StatsGrid() {
  const { giveaways } = useGiveaway();
  const [platformStats, setPlatformStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      try {
        const data = await api.fetchPlatformStats();
        if (isMounted && data) {
          setPlatformStats(data);
        }
      } catch (err) {
        // Silently use live giveaway fallback
      }
    };
    loadStats();
    return () => { isMounted = false; };
  }, []);

  const activeCount = platformStats?.totalGiveaways ?? (giveaways || []).filter((g) => g.status === 'ACTIVE').length;

  const totalParticipants = platformStats?.totalParticipants ?? (giveaways || []).reduce(
    (acc, g) => acc + Number(g.participantsCount || g.spotsTaken || 0),
    0
  );
  const participantStr = totalParticipants >= 1000
    ? `${(totalParticipants / 1000).toFixed(1)}K+`
    : `${totalParticipants.toLocaleString()}`;

  const prizesWon = platformStats?.prizesWon ?? (giveaways || []).reduce((acc, g) => acc + (g.winners?.length || 0), 0);
  const prizesWonStr = prizesWon >= 1000
    ? `${(prizesWon / 1000).toFixed(1)}K+`
    : `${prizesWon.toLocaleString()}`;

  // Find the earliest ending active giveaway from the database (single source of truth)
  const activeWithEnd = React.useMemo(() => {
    return (giveaways || [])
      .filter((g) => g.status === 'ACTIVE' && (g.endsAt || g.endAt))
      .map((g) => ({
        ...g,
        endMs: new Date(g.endsAt || g.endAt).getTime()
      }))
      .filter((g) => !isNaN(g.endMs) && g.endMs > Date.now())
      .sort((a, b) => a.endMs - b.endMs);
  }, [giveaways]);

  const nextEndingGiveaway = activeWithEnd[0] || null;

  // Real target draw time from live MongoDB collection or platformStats
  const targetTime = React.useMemo(() => {
    if (nextEndingGiveaway) return nextEndingGiveaway.endMs;
    if (platformStats?.nextDrawAt) {
      const ms = new Date(platformStats.nextDrawAt).getTime();
      if (!isNaN(ms) && ms > Date.now()) return ms;
    }
    return null;
  }, [nextEndingGiveaway, platformStats]);

  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0, expired: false, ready: false });

  useEffect(() => {
    if (!targetTime) return;

    const updateCountdown = () => {
      const diff = targetTime - Date.now();
      if (diff <= 0) {
        setCd({ d: 0, h: 0, m: 0, s: 0, expired: true, ready: true });
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      setCd({
        d: Math.floor(totalSeconds / 86400),
        h: Math.floor((totalSeconds % 86400) / 3600),
        m: Math.floor((totalSeconds % 3600) / 60),
        s: totalSeconds % 60,
        expired: false,
        ready: true
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  const countdownDisplay = React.useMemo(() => {
    if (!cd.ready) return '-- : -- : --';
    if (cd.expired) return 'Draw in Progress';
    if (cd.d > 0) {
      return `${cd.d}d : ${pad(cd.h)}h : ${pad(cd.m)}m : ${pad(cd.s)}s`;
    }
    return `${pad(cd.h)}h : ${pad(cd.m)}m : ${pad(cd.s)}s`;
  }, [cd]);

  const stats = [
    {
      icon: Gift,
      iconColor: 'text-[#a855f7]',
      iconBg: 'bg-purple-500/15',
      value: String(activeCount),
      valueColor: 'text-white',
      title: 'Total Giveaways',
      subtitle: `${activeCount} Live Pools`,
      border: 'border-purple-500/10',
      glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.12)]',
    },
    {
      icon: Users,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
      value: participantStr,
      valueColor: 'text-white',
      title: 'Total Participants',
      subtitle: 'Verified Entrants',
      border: 'border-blue-500/10',
      glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.12)]',
    },
    {
      icon: Trophy,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/15',
      value: prizesWonStr,
      valueColor: 'text-amber-300',
      title: 'Prizes Won',
      subtitle: 'Audited Draws',
      border: 'border-amber-500/10',
      glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.12)]',
    },
    {
      icon: Clock,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/15',
      value: countdownDisplay,
      valueColor: 'text-cyan-300',
      title: 'Ends In',
      subtitle: nextEndingGiveaway ? nextEndingGiveaway.title : 'Next Audited Draw',
      border: 'border-cyan-500/10',
      glow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.12)]',
      link: nextEndingGiveaway ? `/giveaway/${nextEndingGiveaway.slug || nextEndingGiveaway.id}` : '#active-giveaways'
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map(({ icon: Icon, iconColor, iconBg, value, valueColor, title, subtitle, border, glow, link }) => {
        const Wrapper = link ? 'a' : 'div';
        const wrapperProps = link
          ? {
              href: link,
              className: `relative bg-[#13131a] rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col items-center justify-center gap-2.5 sm:gap-3
                border ${border} border-white/5 text-center
                shadow-lg transition-all duration-300 ${glow}
                overflow-hidden group cursor-pointer hover:border-cyan-500/40 active:scale-[0.99]`
            }
          : {
              className: `relative bg-[#13131a] rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col items-center justify-center gap-2.5 sm:gap-3
                border ${border} border-white/5 text-center
                shadow-lg transition-shadow duration-300 ${glow}
                overflow-hidden group`
            };

        return (
          <Wrapper key={title} {...wrapperProps}>
            {/* Subtle bg glow blob */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full ${iconBg} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />

            {/* Icon */}
            <div className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${iconBg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
            </div>

            {/* Value */}
            <div className={`relative text-xl sm:text-2xl lg:text-[1.7rem] font-extrabold ${valueColor} font-mono leading-none tracking-tight`}>
              {value}
            </div>

            {/* Title & Subtitle */}
            <div className="relative w-full px-1">
              <div className="text-xs font-semibold text-slate-300">{title}</div>
              {subtitle && (
                <div
                  className="text-[10px] font-mono text-slate-400 group-hover:text-cyan-300 transition-colors truncate max-w-full mt-1"
                  title={subtitle}
                >
                  {subtitle}
                </div>
              )}
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}
