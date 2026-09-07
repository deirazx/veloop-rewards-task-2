import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GiveawayProvider } from './context/GiveawayContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import GiveawayDetailsPage from './pages/GiveawayDetailsPage';
import WinnersPage from './pages/WinnersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <GiveawayProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#09090b] text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/giveaways" element={<HomePage />} />
              <Route path="/giveaway/:slug" element={<GiveawayDetailsPage />} />
              <Route path="/giveaway/:id" element={<GiveawayDetailsPage />} />
              <Route path="/winners" element={<WinnersPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          {/* Footer hidden on mobile — BottomNav is used instead via HomePage */}
        </div>
      </Router>
    </GiveawayProvider>
  );
}

export default App;
