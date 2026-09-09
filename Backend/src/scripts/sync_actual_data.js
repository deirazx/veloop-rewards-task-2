const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Giveaway = require('../models/Giveaway');
const Participation = require('../models/Participation');
const Winner = require('../models/Winner');
const User = require('../models/User');

async function syncActualData() {
  try {
    console.log('[Sync] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Sync] Connected successfully.');

    // 1. Purge all fake/mock winners
    console.log('[Sync] Clearing fake winners from winners & giveawaywinners collections...');
    await Winner.deleteMany({});
    try {
      await mongoose.connection.db.collection('giveawaywinners').deleteMany({});
    } catch (e) {
      // collection may not exist or empty
    }

    // 2. Remove seeded mock demo users (e.g. alex.mercer, sneha.patel, rahul.sharma, arjun.singh, tanvi.sharma)
    console.log('[Sync] Removing seeded mock users with fake 15,420 VEs and wins...');
    const demoEmails = [
      'alex.mercer@veloop.io',
      'sneha.patel@veloop.io',
      'rahul.sharma@veloop.io',
      'arjun.singh@veloop.io',
      'tanvi.sharma@veloop.io'
    ];
    await User.deleteMany({ email: { $in: demoEmails } });

    // Also ensure remaining real users have legitimate zero/accurate points and wins
    await User.updateMany(
      {},
      {
        $set: {
          'stats.points': 0,
          'stats.weeklyPoints': 0,
          'stats.wins': 0,
          'stats.entries': 0,
          'stats.badge': 'Contender'
        }
      }
    );

    // 3. Synchronize Giveaway spotsTaken and currentEntries with actual participations
    console.log('[Sync] Recalculating actual giveaway spotsTaken from Participation collection...');
    const giveaways = await Giveaway.find({});

    for (const gw of giveaways) {
      // Count actual participations for this giveaway
      const actualCount = await Participation.countDocuments({
        $or: [
          { giveawayDocId: gw._id },
          { giveawayId: gw.customGiveawayId },
          { giveawayId: gw._id.toString() }
        ]
      });

      gw.spotsTaken = actualCount;
      gw.currentEntries = actualCount;
      gw.participantsCount = actualCount;
      gw.winners = [];
      await gw.save();

      console.log(`  -> Giveaway "${gw.title}": actual entries set to ${actualCount} / ${gw.totalSpots}`);
    }

    // 4. Update user entries based on actual participations
    const users = await User.find({});
    for (const u of users) {
      const userPartCount = await Participation.countDocuments({
        $or: [{ userId: u._id }, { customUserId: u.customUserId }]
      });
      u.stats = u.stats || {};
      u.stats.entries = userPartCount;
      // Points earned from participating: e.g. 50 VEs per giveaway entered
      u.stats.points = userPartCount * 50;
      u.stats.weeklyPoints = userPartCount * 50;
      u.stats.wins = 0; // No winners yet!
      await u.save();
      console.log(`  -> User "${u.name}" (${u.customUserId}): entries=${userPartCount}, points=${u.stats.points}, wins=0`);
    }

    console.log('[Sync] All actual data successfully synchronized with zero mock/inflated numbers.');
    process.exit(0);
  } catch (error) {
    console.error('[Sync Error]', error);
    process.exit(1);
  }
}

syncActualData();
