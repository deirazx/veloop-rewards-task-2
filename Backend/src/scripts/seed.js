const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

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

    // 1. Seed Core Test User VE10025
    console.log('[Seed] Creating demo user VE10025...');
    const user = await User.create({
      customUserId: 'VE10025',
      name: 'Alex Mercer',
      email: 'alex.mercer@veloop.io',
      phone: '+91 98765 43210',
      balances: {
        VES: 350,
        SVES: 300,
        Tokens: 1800
      },
      tier: 'Platinum Elite',
      isKycVerified: true
    });

    // 2. Seed Authoritative Active Giveaways matching specifications
    console.log('[Seed] Seeding active giveaways with exact price points...');
    const now = new Date();
    const activeGiveaways = await Giveaway.create([
      {
        giveawayId: 'giveaway-iphone-15-pro',
        title: 'Apple iPhone 15 Pro (128GB)',
        slug: 'iphone-15-pro',
        status: 'ACTIVE',
        startAt: new Date(now.getTime() - 1000 * 60 * 60 * 24),
        endAt: new Date(now.getTime() + 1000 * 60 * 60 * 36),
        category: 'Flagship Tech',
        totalSpots: 500,
        spotsTaken: 412,
        description: 'Titanium craftsmanship with A17 Pro chip. 100% genuine insured delivery.',
        prizes: [
          {
            prizeId: 'prize-iphone-15-pro',
            name: 'Apple iPhone 15 Pro (128GB)',
            type: 'PHYSICAL',
            currency: 'VES',
            entryFee: 250,
            retailPrice: '₹1,34,900',
            winnerCount: 1
          }
        ]
      },
      {
        giveawayId: 'giveaway-apple-watch-s9',
        title: 'Apple Watch Series 9 GPS',
        slug: 'apple-watch-series-9',
        status: 'ACTIVE',
        startAt: new Date(now.getTime() - 1000 * 60 * 60 * 12),
        endAt: new Date(now.getTime() + 1000 * 60 * 60 * 18),
        category: 'Wearables',
        totalSpots: 350,
        spotsTaken: 278,
        description: 'Advanced health metrics, ECG, and S9 SiP processor.',
        prizes: [
          {
            prizeId: 'prize-watch-s9',
            name: 'Apple Watch Series 9 GPS',
            type: 'PHYSICAL',
            currency: 'VES',
            entryFee: 200,
            retailPrice: '₹44,900',
            winnerCount: 1
          }
        ]
      },
      {
        giveawayId: 'giveaway-airpods-pro',
        title: 'AirPods Pro (2nd Generation)',
        slug: 'airpods-pro-2nd-gen',
        status: 'ACTIVE',
        startAt: new Date(now.getTime() - 1000 * 60 * 60 * 6),
        endAt: new Date(now.getTime() + 1000 * 60 * 60 * 4),
        category: 'Audio',
        totalSpots: 200,
        spotsTaken: 184,
        description: 'Pro Active Noise Cancellation and USB-C MagSafe case.',
        prizes: [
          {
            prizeId: 'prize-airpods-pro',
            name: 'AirPods Pro (2nd Generation)',
            type: 'PHYSICAL',
            currency: 'SVES',
            entryFee: 500,
            retailPrice: '₹24,900',
            winnerCount: 1
          }
        ]
      },
      {
        giveawayId: 'giveaway-amazon-voucher-2k',
        title: '₹2,000 Amazon Pay E-Voucher',
        slug: 'amazon-voucher-2000',
        status: 'ACTIVE',
        startAt: new Date(now.getTime() - 1000 * 60 * 60 * 10),
        endAt: new Date(now.getTime() + 1000 * 60 * 60 * 72),
        category: 'Digital Voucher',
        totalSpots: 1000,
        spotsTaken: 620,
        description: 'Direct digital voucher pin dispatched instantly to verified email.',
        prizes: [
          {
            prizeId: 'prize-amazon-2k',
            name: '₹2,000 Amazon Pay E-Voucher',
            type: 'GIFT_CARD',
            currency: 'VES',
            entryFee: 500,
            retailPrice: '₹2,000',
            winnerCount: 5
          }
        ]
      },
      {
        giveawayId: 'giveaway-token-voucher-20',
        title: '₹20 Instant Recharge Voucher',
        slug: 'micro-voucher-20',
        status: 'ACTIVE',
        startAt: new Date(now.getTime() - 1000 * 60 * 60 * 4),
        endAt: new Date(now.getTime() + 1000 * 60 * 60 * 12),
        category: 'Community Token Draw',
        totalSpots: 5000,
        spotsTaken: 3410,
        description: 'Exchange platform tokens for quick liquid recharge vouchers.',
        prizes: [
          {
            prizeId: 'prize-token-20',
            name: '₹20 Instant Recharge Voucher',
            type: 'GIFT_CARD',
            currency: 'Tokens',
            entryFee: 2000,
            retailPrice: '₹20',
            winnerCount: 50
          }
        ]
      }
    ]);

    // 3. Seed Concluded Giveaway with Winner Record for VE10025 (Alex Mercer) to test claim flow
    console.log('[Seed] Seeding concluded giveaway and audited winner...');
    const endedGiveaway = await Giveaway.create({
      giveawayId: 'giveaway-ended-macbook-pro',
      title: 'MacBook Pro 14" M3 Pro (Completed)',
      slug: 'macbook-pro-m3-ended',
      status: 'ENDED',
      startAt: new Date(now.getTime() - 1000 * 60 * 60 * 96),
      endAt: new Date(now.getTime() - 1000 * 60 * 60 * 12),
      category: 'Pro Hardware',
      totalSpots: 500,
      spotsTaken: 500,
      prizes: [
        {
          prizeId: 'prize-macbook-pro',
          name: 'MacBook Pro 14" M3 Pro',
          type: 'PHYSICAL',
          currency: 'VES',
          entryFee: 800,
          retailPrice: '₹1,99,900',
          winnerCount: 1
        }
      ]
    });

    await Winner.create({
      giveawayId: endedGiveaway.giveawayId,
      giveawayDocId: endedGiveaway._id,
      userId: user._id,
      customUserId: user.customUserId,
      maskedUserId: 'VE****25',
      ticketNumber: 'TK-889412',
      prizeId: 'prize-macbook-pro',
      prizeName: 'MacBook Pro 14" M3 Pro',
      prizeType: 'PHYSICAL',
      drawTimestamp: new Date(now.getTime() - 1000 * 60 * 60 * 10),
      claimStatus: 'UNCLAIMED'
    });

    console.log('\n=================================================');
    console.log('✅ SEED COMPLETED SUCCESSFULLY!');
    console.log(`Demo User: ${user.customUserId} (${user.name})`);
    console.log(`Balances: VES=${user.balances.VES}, SVES=${user.balances.SVES}, Tokens=${user.balances.Tokens}`);
    console.log(`Active Giveaways Seeded: ${activeGiveaways.length}`);
    console.log(`Concluded Winner Seeded: 1 (Ready for Claim Test)`);
    console.log('=================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
