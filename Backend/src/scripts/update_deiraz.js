const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const updated = await User.findOneAndUpdate(
    { customUserId: 'VE44226' },
    {
      $set: {
        'stats.points': 4500,
        'stats.weeklyPoints': 4500,
        'stats.entries': 50,
        'stats.wins': 3,
        'stats.badge': 'Challenger'
      }
    },
    { new: true }
  );
  console.log('SUCCESS: Deiraz stats updated:', updated.customUserId, updated.name, updated.stats);
  process.exit(0);
}

run().catch((err) => {
  console.error('Update failed:', err);
  process.exit(1);
});
