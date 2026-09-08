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

// Ensure public assets exist for local static serving
try {
  const srcDir = path.resolve(__dirname, '../../../Frontend/src/assets');
  const targetDir = path.resolve(__dirname, '../../../Frontend/public/assets');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const assetMap = {
    'iphone-prize.jpg': 'iphone-prize.png',
    'apple-watch.jpg': 'apple-watch.png',
    'airpods.jpg': 'airpods.png',
    'amazon.jpg': 'amazon-prize.png',
    'digital-coin-token.jpg': 'token.png'
  };

  for (const [srcFile, targetFile] of Object.entries(assetMap)) {
    const srcPath = path.join(srcDir, srcFile);
    const targetPath = path.join(targetDir, targetFile);
    if (fs.existsSync(srcPath) && !fs.existsSync(targetPath)) {
      fs.copyFileSync(srcPath, targetPath);
    }
  }
} catch (e) {
  console.warn('[Asset Copy Note]', e.message);
}

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
          points: 15420,
          weeklyPoints: 3650,
          entries: 142,
          wins: 9,
          badge: 'Legendary',
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
          points: 12850,
          weeklyPoints: 4210,
          entries: 118,
          wins: 7,
          badge: 'Master',
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
          points: 10940,
          weeklyPoints: 2940,
          entries: 95,
          wins: 5,
          badge: 'Elite',
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
          points: 8730,
          weeklyPoints: 2510,
          entries: 74,
          wins: 4,
          badge: 'Diamond',
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
          points: 7150,
          weeklyPoints: 3890,
          entries: 62,
          wins: 3,
          badge: 'Platinum',
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
        endAt: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days left
        category: 'Flagship Tech',
        entryFee: 250,
        currency: 'VEs',
        retailPrice: '₹1,34,900',
        totalSpots: 500,
        spotsTaken: 413,
        currentEntries: 413,
        maxEntries: 500,
        participantsCount: 8500,
        image: '/assets/iphone-prize.png',
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
            image: '/assets/iphone-prize.png'
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
        endAt: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000), // 12 days left
        category: 'Wearables',
        entryFee: 200,
        currency: 'VEs',
        retailPrice: '₹44,900',
        totalSpots: 350,
        spotsTaken: 278,
        currentEntries: 278,
        maxEntries: 350,
        participantsCount: 4320,
        image: '/assets/apple-watch.png',
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
            image: '/assets/apple-watch.png'
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
        endAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days left
        category: 'Audio',
        entryFee: 500,
        currency: 'SVEs',
        retailPrice: '₹24,900',
        totalSpots: 200,
        spotsTaken: 184,
        currentEntries: 184,
        maxEntries: 200,
        participantsCount: 3180,
        image: '/assets/airpods.png',
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
            image: '/assets/airpods.png'
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
        endAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days left
        category: 'Digital Voucher',
        entryFee: 500,
        currency: 'VEs',
        retailPrice: '₹2,000',
        totalSpots: 1000,
        spotsTaken: 650,
        currentEntries: 650,
        maxEntries: 1000,
        participantsCount: 6450,
        image: '/assets/amazon-prize.png',
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
            image: '/assets/amazon-prize.png'
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
        endAt: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000), // 8 days left
        category: 'Digital Voucher',
        entryFee: 300,
        currency: 'VEs',
        retailPrice: '₹500',
        totalSpots: 3000,
        spotsTaken: 2150,
        currentEntries: 2150,
        maxEntries: 3000,
        participantsCount: 4200,
        image: '/assets/amazon-prize.png',
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
            image: '/assets/amazon-prize.png'
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
        endAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days left
        category: 'Community Token Draw',
        entryFee: 2000,
        currency: 'Tokens',
        retailPrice: '₹20',
        totalSpots: 5000,
        spotsTaken: 3400,
        currentEntries: 3400,
        maxEntries: 5000,
        participantsCount: 12800,
        image: '/assets/token.png',
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
            image: '/assets/token.png'
          }
        ]
      }
    ]);

    // 3. Seed Exactly 2 Concluded Giveaways with Past Dates for Audited Winners Hub (Rule 62)
    console.log('[Seed] Seeding 2 completed giveaways with approved platform prizes...');
    const endedGiveaway1 = await Giveaway.create({
      giveawayId: 'giveaway-ended-watch',
      title: 'Apple Watch Series 9 GPS (Round 1 Completed)',
      slug: 'apple-watch-series-9-ended',
      status: 'ENDED',
      startAt: new Date(now.getTime() - 1000 * 60 * 60 * 96),
      endAt: new Date(now.getTime() - 1000 * 60 * 60 * 12),
      category: 'Wearables',
      entryFee: 200,
      currency: 'VEs',
      retailPrice: '₹44,900',
      totalSpots: 350,
      spotsTaken: 350,
      currentEntries: 350,
      maxEntries: 350,
      participantsCount: 4320,
      prizes: [
        {
          prizeId: 'prize-watch-ended',
          name: 'Apple Watch Series 9 GPS',
          type: 'PHYSICAL',
          currency: 'VEs',
          entryFee: 200,
          retailPrice: '₹44,900',
          winnerCount: 1,
          image: '/assets/apple-watch.png'
        }
      ]
    });

    const endedGiveaway2 = await Giveaway.create({
      giveawayId: 'giveaway-ended-amazon',
      title: '₹2,000 Amazon Gift Voucher (Round 1 Completed)',
      slug: 'amazon-gift-voucher-2000-ended',
      status: 'ENDED',
      startAt: new Date(now.getTime() - 1000 * 60 * 60 * 144),
      endAt: new Date(now.getTime() - 1000 * 60 * 60 * 24),
      category: 'Digital Voucher',
      entryFee: 500,
      currency: 'VEs',
      retailPrice: '₹2,000',
      totalSpots: 1000,
      spotsTaken: 1000,
      currentEntries: 1000,
      maxEntries: 1000,
      participantsCount: 8450,
      prizes: [
        {
          prizeId: 'prize-amazon-2000-ended',
          name: '₹2,000 Amazon Gift Voucher',
          type: 'GIFT_CARD',
          currency: 'VEs',
          entryFee: 500,
          retailPrice: '₹2,000',
          winnerCount: 2,
          image: '/assets/amazon-prize.png'
        },
        {
          prizeId: 'prize-amazon-500-ended',
          name: '₹500 Amazon Gift Voucher',
          type: 'GIFT_CARD',
          currency: 'VEs',
          entryFee: 300,
          retailPrice: '₹500',
          winnerCount: 2,
          image: '/assets/amazon-prize.png'
        }
      ]
    });

    // 4. Seed 5 Audited Winners linked strictly to Approved Platform Prizes (Rule 25 & 62)
    console.log('[Seed] Seeding 5 audited Winner records with approved platform prizes...');
    const winners = await Winner.create([
      {
        giveawayId: endedGiveaway1.giveawayId,
        giveawayDocId: endedGiveaway1._id,
        userId: users[0]._id,
        customUserId: users[0].customUserId,
        maskedUserId: 'VE****25',
        ticketNumber: 'TK-889412',
        prizeId: 'prize-watch-ended',
        prizeName: 'Apple Watch Series 9 GPS',
        prizeType: 'PHYSICAL',
        drawTimestamp: new Date(now.getTime() - 1000 * 60 * 60 * 10),
        claimStatus: 'UNCLAIMED'
      },
      {
        giveawayId: endedGiveaway2.giveawayId,
        giveawayDocId: endedGiveaway2._id,
        userId: users[1]._id,
        customUserId: users[1].customUserId,
        maskedUserId: 'VE****42',
        ticketNumber: 'TK-774042',
        prizeId: 'prize-amazon-2000-ended',
        prizeName: '₹2,000 Amazon Gift Voucher',
        prizeType: 'GIFT_CARD',
        drawTimestamp: new Date(now.getTime() - 1000 * 60 * 60 * 22),
        claimStatus: 'CLAIMED'
      },
      {
        giveawayId: endedGiveaway2.giveawayId,
        giveawayDocId: endedGiveaway2._id,
        userId: users[2]._id,
        customUserId: users[2].customUserId,
        maskedUserId: 'VE****91',
        ticketNumber: 'TK-118491',
        prizeId: 'prize-amazon-2000-ended',
        prizeName: '₹2,000 Amazon Gift Voucher',
        prizeType: 'GIFT_CARD',
        drawTimestamp: new Date(now.getTime() - 1000 * 60 * 60 * 20),
        claimStatus: 'CLAIMED'
      },
      {
        giveawayId: endedGiveaway2.giveawayId,
        giveawayDocId: endedGiveaway2._id,
        userId: users[3]._id,
        customUserId: users[3].customUserId,
        maskedUserId: 'VE****78',
        ticketNumber: 'TK-552178',
        prizeId: 'prize-amazon-500-ended',
        prizeName: '₹500 Amazon Gift Voucher',
        prizeType: 'GIFT_CARD',
        drawTimestamp: new Date(now.getTime() - 1000 * 60 * 60 * 18),
        claimStatus: 'CLAIMED'
      },
      {
        giveawayId: endedGiveaway2.giveawayId,
        giveawayDocId: endedGiveaway2._id,
        userId: users[4]._id,
        customUserId: users[4].customUserId,
        maskedUserId: 'VE****63',
        ticketNumber: 'TK-339063',
        prizeId: 'prize-amazon-500-ended',
        prizeName: '₹500 Amazon Gift Voucher',
        prizeType: 'GIFT_CARD',
        drawTimestamp: new Date(now.getTime() - 1000 * 60 * 60 * 16),
        claimStatus: 'CLAIMED'
      }
    ]);

    console.log('\n=================================================');
    console.log('✅ SEED COMPLETED SUCCESSFULLY!');
    console.log(`Demo Users Seeded: ${users.length} (Primary: ${primaryUser.customUserId})`);
    console.log(`Active Giveaways Seeded: ${activeGiveaways.length} (gw-1 to gw-6)`);
    console.log(`Completed Giveaways Seeded: 2 (${endedGiveaway1.slug}, ${endedGiveaway2.slug})`);
    console.log(`Audited Winners Seeded: ${winners.length} (Masked IDs: ${winners.map(w => w.maskedUserId).join(', ')})`);
    console.log('=================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
