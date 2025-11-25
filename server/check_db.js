const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tradelink';

async function checkDb() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    const userCount = await mongoose.connection.db.collection('users').countDocuments();
    const tradeCount = await mongoose.connection.db.collection('tradelistings').countDocuments();
    
    console.log(`Users count: ${userCount}`);
    console.log(`Trade Listings count: ${tradeCount}`);
    
    if (userCount > 0) {
      const user = await mongoose.connection.db.collection('users').findOne();
      console.log('Sample user:', JSON.stringify(user, null, 2));
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

checkDb();
