const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Message = require('./models/Message');

const MONGO_URI = process.env.MONGO_URI;

const seedMessages = async () => {
  try {
    console.log('Connected to MongoDB');
    
    // Find Users
    const john = await User.findOne({ email: 'john@builder.com' });
    const sarah = await User.findOne({ email: 'sarah@plumber.com' });

    if (!john || !sarah) {
      console.error('Users not found. Please run seed_listings.js first.');
      process.exit(1);
    }

    console.log(`Found users: ${john.name} (${john._id}) and ${sarah.name} (${sarah._id})`);

    // Clear existing messages between them
    await Message.deleteMany({
      $or: [
        { senderId: john._id.toString(), receiverId: sarah._id.toString() },
        { senderId: sarah._id.toString(), receiverId: john._id.toString() }
      ]
    });

    const messages = [
      {
        senderId: john._id.toString(),
        senderName: john.name,
        receiverId: sarah._id.toString(),
        receiverName: sarah.name,
        message: 'Hey Sarah, are you available for a plumbing job next week?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true
      },
      {
        senderId: sarah._id.toString(),
        senderName: sarah.name,
        receiverId: john._id.toString(),
        receiverName: john.name,
        message: 'Hi John! Yes, I have availability. What is the scope?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
        read: true
      },
      {
        senderId: john._id.toString(),
        senderName: john.name,
        receiverId: sarah._id.toString(),
        receiverName: sarah.name,
        message: 'It is a residential rough-in in NW. About 2000 sqft.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false
      }
    ];

    await Message.insertMany(messages);
    console.log(`Seeded ${messages.length} messages between John and Sarah.`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

mongoose.connect(MONGO_URI)
  .then(seedMessages)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
