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
