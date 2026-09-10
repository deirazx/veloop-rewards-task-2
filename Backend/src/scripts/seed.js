const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

const User = require('../models/User');
const Giveaway = require('../models/Giveaway');
const Winner = require('../models/Winner');
const Participation = require('../models/Participation');
const Transaction = require('../models/Transaction');
const Claim = require('../models/Claim');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Purging existing test records...');
    await Promise.all([
      User.deleteMany({}),
      Giveaway.deleteMany({}),
      Winner.deleteMany({}),
      Participation.deleteMany({}),
      Transaction.deleteMany({}),
      Claim.deleteMany({})
    ]);

    // 1. Seed Core Test Users with Leaderboard Stats
    console.log('[Seed] Creating demo users with PDF Rule 25 IDs...');
    const users = await User.create([
      {
        customUserId: 'VE10025',
        name: 'Alex Mercer',
        email: 'alex.mercer@veloop.io',
        password: 'Password@123',
        phone: '+91 98765 43210',
        balances: { VES: 1000, SVES: 1500, Tokens: 3000 },
        tier: 'Platinum Elite',
        isKycVerified: true,
        stats: {
          points: 0,
          weeklyPoints: 0,
          entries: 0,
          wins: 0,
          badge: 'Contender',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
        }
      },
      {
        customUserId: 'VE10042',
        name: 'Sneha Patel',
        email: 'sneha.patel@veloop.io',
        password: 'Password@123',
        phone: '+91 98765 43211',
        balances: { VES: 850, SVES: 1200, Tokens: 2500 },
        tier: 'Gold',
        isKycVerified: true,
        stats: {
          points: 0,
          weeklyPoints: 0,
          entries: 0,
          wins: 0,
          badge: 'Contender',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
        }
      },
      {
        customUserId: 'VE10091',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@veloop.io',
        password: 'Password@123',
        phone: '+91 98765 43212',
        balances: { VES: 600, SVES: 800, Tokens: 1800 },
        tier: 'Gold',
        isKycVerified: true,
        stats: {
          points: 0,
          weeklyPoints: 0,
          entries: 0,
          wins: 0,
          badge: 'Contender',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80'
        }
      },
      {
        customUserId: 'VE10078',
        name: 'Arjun Singh',
        email: 'arjun.singh@veloop.io',
        password: 'Password@123',
        phone: '+91 98765 43213',
        balances: { VES: 450, SVES: 600, Tokens: 1200 },
        tier: 'Silver',
        isKycVerified: true,
        stats: {
          points: 0,
          weeklyPoints: 0,
          entries: 0,
          wins: 0,
          badge: 'Contender',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
        }
      },
      {
        customUserId: 'VE10063',
        name: 'Tanvi Sharma',
        email: 'tanvi.sharma@veloop.io',
        password: 'Password@123',
        phone: '+91 98765 43214',
        balances: { VES: 300, SVES: 500, Tokens: 900 },
        tier: 'Silver',
        isKycVerified: true,
        stats: {
          points: 0,
          weeklyPoints: 0,
          entries: 0,
          wins: 0,
          badge: 'Contender',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80'
        }
      }
    ]);

    const primaryUser = users[0];

    // 2. Seed EXACTLY the 6 Active Giveaways required by PDF Specification
    console.log('[Seed] Seeding exactly 6 active giveaways matching PDF specification...');
    const now = new Date();

    const activeGiveaways = await Giveaway.create([
      // 1. iPhone 15 Pro
      {
        giveawayId: 'gw-1',
        title: 'Apple iPhone 15 Pro (128GB)',
        slug: 'iphone-15-pro',
        status: 'ACTIVE',
        startAt: new Date(now.getTime() - 1000 * 60 * 60 * 24),
        endAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // Grand Pool: 30-Day Monthly Cycle
        category: 'Flagship Tech',
        entryFee: 250,
        currency: 'VEs',
        retailPrice: '₹1,34,900',
        totalSpots: 500,
        spotsTaken: 0,
        currentEntries: 0,
        maxEntries: 500,
        participantsCount: 0,
        image: '/assets/iphone-prize.jpg',
        description: 'Titanium craftsmanship with A17 Pro chip. 100% genuine insured delivery.',
        prizes: [
          {
            prizeId: 'prize-gw-1',
            name: 'Apple iPhone 15 Pro (128GB)',
            type: 'PHYSICAL',
            currency: 'VEs',
            entryFee: 250,
            retailPrice: '₹1,34,900',
            winnerCount: 1,
            image: '/assets/iphone-prize.jpg'
          }
        ]
      },
      // 2. Apple Watch Series 9
      {
        giveawayId: 'gw-2',
        title: 'Apple Watch Series 9 GPS',
        slug: 'apple-watch-series-9',
        status: 'ACTIVE',
        startAt: new Date(now.getTime() - 1000 * 60 * 60 * 12),
        endAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Weekly Pool: 7-Day Cycle
        category: 'Wearables',
        entryFee: 200,
        currency: 'VEs',
        retailPrice: '₹44,900',
        totalSpots: 350,
        spotsTaken: 0,
        currentEntries: 0,
        maxEntries: 350,
        participantsCount: 0,
        image: '/assets/apple-watch.jpg',
        description: 'Advanced health metrics, ECG, and S9 SiP processor.',
        prizes: [
          {
            prizeId: 'prize-gw-2',
            name: 'Apple Watch Series 9 GPS',
            type: 'PHYSICAL',
            currency: 'VEs',
            entryFee: 200,
            retailPrice: '₹44,900',
            winnerCount: 1,
            image: '/assets/apple-watch.jpg'
          }
        ]
      },
      // 3. AirPods Pro (2nd Gen)
      {
        giveawayId: 'gw-3',
        title: 'AirPods Pro (2nd Generation)',
        slug: 'airpods-pro-2nd-gen',
        status: 'ACTIVE',
        startAt: new Date(now.getTime() - 1000 * 60 * 60 * 6),
        endAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Weekly Pool: 7-Day Cycle
        category: 'Audio',
        entryFee: 500,
        currency: 'SVEs',
        retailPrice: '₹24,900',
        totalSpots: 200,
        spotsTaken: 0,
        currentEntries: 0,
        maxEntries: 200,
        participantsCount: 0,
        image: '/assets/airpods.jpg',
        description: 'Pro Active Noise Cancellation and USB-C MagSafe case.',
        prizes: [
          {
            prizeId: 'prize-gw-3',
            name: 'AirPods Pro (2nd Generation)',
            type: 'PHYSICAL',
            currency: 'SVEs',
            entryFee: 500,
            retailPrice: '₹24,900',
            winnerCount: 1,
            image: '/assets/airpods.jpg'
          }
        ]
      },
      // 4. ₹2,000 Amazon Gift Voucher
      {
        giveawayId: 'gw-4',
        title: '₹2,000 Amazon Gift Voucher',
        slug: 'amazon-gift-voucher-2000',
        status: 'ACTIVE',
        startAt: new Date(now.getTime() - 1000 * 60 * 60 * 10),
        endAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Weekly Pool: 7-Day Cycle
        category: 'Digital Voucher',
        entryFee: 500,
        currency: 'VEs',
        retailPrice: '₹2,000',
        totalSpots: 1000,
        spotsTaken: 0,
        currentEntries: 0,
        maxEntries: 1000,
        participantsCount: 0,
        image: '/assets/amazon-2000.jpg',
        description: 'Direct digital voucher pin dispatched instantly to verified email.',
        prizes: [
          {
            prizeId: 'prize-gw-4',
            name: '₹2,000 Amazon Gift Voucher',
            type: 'GIFT_CARD',
            currency: 'VEs',
            entryFee: 500,
            retailPrice: '₹2,000',
            winnerCount: 5,
            image: '/assets/amazon-2000.jpg'
          }
        ]
      },
      // 5. ₹500 Amazon Gift Voucher
      {
        giveawayId: 'gw-5',
        title: '₹500 Amazon Gift Voucher',
        slug: 'amazon-gift-voucher-500',
        status: 'ACTIVE',
        startAt: new Date(now.getTime() - 1000 * 60 * 60 * 8),
        endAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // Bi-Weekly Pool: 3-Day Cycle
        category: 'Digital Voucher',
        entryFee: 300,
        currency: 'VEs',
        retailPrice: '₹500',
        totalSpots: 3000,
        spotsTaken: 0,
        currentEntries: 0,
        maxEntries: 3000,
        participantsCount: 0,
        image: '/assets/amazon-500.png',
        description: 'Quick shopping boost. Instant digital gift card voucher for Amazon Pay.',
        prizes: [
          {
            prizeId: 'prize-gw-5',
            name: '₹500 Amazon Gift Voucher',
            type: 'GIFT_CARD',
            currency: 'VEs',
            entryFee: 300,
            retailPrice: '₹500',
            winnerCount: 10,
            image: '/assets/amazon-500.png'
          }
        ]
      },
      // 6. ₹20 Instant Recharge Voucher
      {
        giveawayId: 'gw-6',
        title: '₹20 Instant Recharge Voucher',
        slug: 'micro-voucher-20',
        status: 'ACTIVE',
        startAt: new Date(now.getTime() - 1000 * 60 * 60 * 4),
        endAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Fast-Draw Pool: 24-Hour Daily Cycle
        category: 'Community Token Draw',
        entryFee: 2000,
        currency: 'Tokens',
        retailPrice: '₹20',
        totalSpots: 5000,
        spotsTaken: 0,
        currentEntries: 0,
        maxEntries: 5000,
        participantsCount: 0,
        image: '/assets/recharge-voucher.png',
        description: 'Exchange platform tokens for quick liquid recharge vouchers.',
        prizes: [
          {
            prizeId: 'prize-gw-6',
            name: '₹20 Instant Recharge Voucher',
            type: 'GIFT_CARD',
            currency: 'Tokens',
            entryFee: 2000,
            retailPrice: '₹20',
            winnerCount: 50,
            image: '/assets/recharge-voucher.png'
          }
        ]
      }
    ]);

    // 3. Season 1 Live State: Zero dummy completed giveaways or fake winners
    console.log('[Seed] Season 1 active: 0 completed giveaways and 0 artificial winners seeded.');

    console.log('\n=================================================');
    console.log('✅ SEED COMPLETED SUCCESSFULLY!');
    console.log(`Demo Users Seeded: ${users.length} (Primary: ${primaryUser.customUserId})`);
    console.log(`Active Giveaways Seeded: ${activeGiveaways.length} (gw-1 to gw-6)`);
    console.log(`Completed Giveaways Seeded: 0 (Pure live state)`);
    console.log(`Audited Winners Seeded: 0 (Awaiting real draw outcomes)`);
    console.log('=================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
