import React from 'react';
import HeroSection from '../components/giveaway/HeroSection';
import StatsGrid from '../components/giveaway/StatsGrid';
import LiveWinnersTicker from '../components/giveaway/WinnerMarquee';
import ActiveGiveaways from '../components/giveaway/ActiveGiveaways';
import HowItWorks from '../components/giveaway/HowItWorks';
import TrustSection from '../components/giveaway/TrustSection';
import RulesSection from '../components/giveaway/RulesSection';
import WinnersList from '../components/common/WinnersList';
import Leaderboard from '../components/common/Leaderboard';
import FAQSection from '../components/giveaway/FAQSection';

export default function HomePage() {
  return (
    <>
      {/* Full-width winner ticker */}
      <LiveWinnersTicker />

      {/* Main page content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-28 md:pb-16 flex flex-col gap-10 sm:gap-14 md:gap-20">

        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Stats Grid */}
        <StatsGrid />

        {/* 3. Active Giveaways - horizontal scroll & filter */}
        <ActiveGiveaways />

        {/* 4. How It Works - Step-by-Step Overview */}
        <HowItWorks />

        {/* 5. Trust Section - 100% Transparent, Secure & Fair */}
        <TrustSection />

        {/* 6. Rules & Guidelines - Eligibility, Entry, Disqualification */}
        <RulesSection />

        {/* 7. Leaderboard - 3D Podium + Rankings Table */}
        <Leaderboard />

        {/* 8. Winner Announcements */}
        <WinnersList />

        {/* 9. Expandable FAQ Section */}
        <FAQSection />
      </main>
    </>
  );
}
