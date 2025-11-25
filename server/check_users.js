const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tradelink';

async function checkUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    const users = await mongoose.connection.db.collection('users').find({}, { projection: { email: 1, name: 1, _id: 0 } }).toArray();
    
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- Email: "${user.email}", Name: "${user.name}"`);
    });
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

checkUsers();
