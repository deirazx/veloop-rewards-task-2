import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GiveawayProvider } from './context/GiveawayContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import GiveawayDetailsPage from './pages/GiveawayDetailsPage';
import WinnersPage from './pages/WinnersPage';

function App() {
  return (
    <GiveawayProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-obsidian text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/giveaway/:slug" element={<GiveawayDetailsPage />} />
              <Route path="/giveaway/:id" element={<GiveawayDetailsPage />} />
              <Route path="/winners" element={<WinnersPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </GiveawayProvider>
  );
}

export default App;
