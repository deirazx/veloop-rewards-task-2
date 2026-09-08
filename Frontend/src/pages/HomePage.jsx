import React from 'react';
import HeroSection from '../components/giveaway/HeroSection';
import StatsGrid from '../components/giveaway/StatsGrid';
import LiveWinnersTicker from '../components/giveaway/WinnerMarquee';
import ActiveGiveaways from '../components/giveaway/ActiveGiveaways';
import WinnersList from '../components/common/WinnersList';

export default function HomePage() {
  return (
    <>
      {/* ── Full-width ticker ── */}
      <LiveWinnersTicker />

      {/* ── Main page content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-16 flex flex-col gap-12 sm:gap-16 md:gap-20">

        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Stats */}
        <StatsGrid />

        {/* 3. Active Giveaways (full grid on desktop) */}
        <ActiveGiveaways />

        {/* 4. Winner Announcements (Auto-refreshing) */}
        <WinnersList />
      </main>
    </>
  );
}
