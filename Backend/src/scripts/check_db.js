const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections in Atlas:', collections.map(c => c.name));
  for (const c of collections) {
    const count = await mongoose.connection.db.collection(c.name).countDocuments();
    const sample = await mongoose.connection.db.collection(c.name).findOne({});
    console.log('\n--- Collection: ' + c.name + ' (' + count + ' docs) ---');
    console.log('Sample:', JSON.stringify(sample, null, 2));
  }
  process.exit(0);
}

run().catch(console.error);
