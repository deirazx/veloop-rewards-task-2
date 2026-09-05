const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/veloop_giveaway';
    
    const conn = await mongoose.connect(mongoURI, {
      autoIndex: true, // Build indexes in dev/staging
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Drop stale legacy indexes that cause E11000 duplicate key errors
    // Old schema had a 'userId' unique index; new schema uses 'customUserId'
    try {
      const db = conn.connection.db;
      const usersCollection = db.collection('users');
      const indexes = await usersCollection.indexes();

      const staleIndexNames = ['userId_1', 'userId_1_unique'];
      for (const staleIdx of staleIndexNames) {
        const exists = indexes.some((idx) => idx.name === staleIdx);
        if (exists) {
          await usersCollection.dropIndex(staleIdx);
          console.log(`[MongoDB] Dropped stale index: ${staleIdx}`);
        }
      }
    } catch (idxErr) {
      // Non-fatal: index may not exist or already dropped
      if (!idxErr.message.includes('index not found')) {
        console.warn('[MongoDB] Index cleanup note:', idxErr.message);
      }
    }
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from database cluster.');
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB Error]', err);
});

module.exports = connectDB;
