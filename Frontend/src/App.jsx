import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GiveawayProvider } from './context/GiveawayContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import GiveawayDetailsPage from './pages/GiveawayDetailsPage';
import WinnersPage from './pages/WinnersPage';
import MyEntriesPage from './pages/MyEntriesPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BottomNav from './components/common/BottomNav';

function App() {
  return (
    <GiveawayProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#09090b] text-white">
          <Navbar />
          <main className="flex-grow pb-24 md:pb-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/giveaways" element={<HomePage />} />
              <Route path="/giveaway/:slug" element={<GiveawayDetailsPage />} />
              <Route path="/giveaway/:id" element={<GiveawayDetailsPage />} />
              <Route path="/winners" element={<WinnersPage />} />
              <Route path="/entries" element={<MyEntriesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
          {/* Mobile-only persistent bottom navigation bar */}
          <div className="md:hidden">
            <BottomNav />
          </div>
        </div>
      </Router>
    </GiveawayProvider>
  );
}

export default App;
