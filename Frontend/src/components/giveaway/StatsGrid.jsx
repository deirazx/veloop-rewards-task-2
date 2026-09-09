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
        console.error('[StatsGrid] Failed to fetch live platform stats:', err);
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

  // Live countdown to next draw from database
  const activeGiveaway = (giveaways || []).find((g) => g.status === 'ACTIVE');
  const targetTime = platformStats?.nextDrawAt
    ? new Date(platformStats.nextDrawAt).getTime()
    : activeGiveaway?.endsAt
      ? new Date(activeGiveaway.endsAt).getTime()
      : Date.now() + 86400000;

  const [cd, setCd] = useState({ d: 0, h: 0, m: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, targetTime - Date.now());
      const s = Math.floor(diff / 1000);
      return {
        d: Math.floor(s / 86400),
        h: Math.floor((s % 86400) / 3600),
        m: Math.floor((s % 3600) / 60)
      };
    };
    setCd(calc());
    const interval = setInterval(() => setCd(calc()), 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  const stats = [
    {
      icon: Gift,
      iconColor: 'text-[#a855f7]',
      iconBg: 'bg-purple-500/15',
      value: String(activeCount),
      valueColor: 'text-white',
      title: 'Total Giveaways',
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
      border: 'border-amber-500/10',
      glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.12)]',
    },
    {
      icon: Clock,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/15',
      value: `${cd.d}d : ${pad(cd.h)}h : ${pad(cd.m)}m`,
      valueColor: 'text-cyan-300',
      title: 'Ends In',
      border: 'border-cyan-500/10',
      glow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.12)]',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map(({ icon: Icon, iconColor, iconBg, value, valueColor, title, border, glow }) => (
        <div
          key={title}
          className={`relative bg-[#13131a] rounded-2xl p-5 lg:p-6 flex flex-col items-center justify-center gap-3
            border ${border} border-white/5 text-center
            shadow-lg transition-shadow duration-300 ${glow}
            overflow-hidden group`}
        >
          {/* Subtle bg glow blob */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full ${iconBg} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />

          {/* Icon */}
          <div className={`relative w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>

          {/* Value */}
          <div className={`relative text-2xl lg:text-3xl font-extrabold ${valueColor} font-mono leading-none tracking-tight`}>
            {value}
          </div>

          {/* Title Label without redundant sub-labels */}
          <div className="relative">
            <div className="text-xs font-semibold text-slate-300">{title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
