const mongoose = require('mongoose');
require('dotenv').config();
const TradeListing = require('./models/tadelistings');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;

const tradeTypes = [
  'Demolition',
  'Foundation Grader',
  'Foundation Pouring',
  'Framing',
  'Plumber',
  'Electrician',
  'Heating',
  'Roofing',
  'Drywall',
  'Siding',
  'Finisher',
  'Tile/Floor',
  'Counter',
  'Fireplace',
  'Door and Window',
  'Lumber'
];

const serviceAreas = ['NE', 'NW', 'SE', 'SW'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomAreas() {
  const num = getRandomInt(1, 4);
  const shuffled = serviceAreas.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

const seedData = async () => {
  try {
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await TradeListing.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing listings and users');

    // Legacy/Test Users
    const listings = [];
    const legacyUsers = [
      { name: 'John Builder', email: 'john@builder.com', role: 'builder', phone: '403-555-9001' },
      { name: 'Mike Carpenter', email: 'mike@carpenter.com', role: 'tradesman', phone: '403-555-9002' },
      { name: 'Sarah Plumber', email: 'sarah@plumber.com', role: 'tradesman', phone: '403-555-9003' },
      { name: 'Admin User', email: 'admin@a.com', role: 'other', phone: '403-555-9004' }
    ];

    for (const u of legacyUsers) {
      const user = new User(u);
      await user.save();
      console.log(`Restored user: ${user.email}`);
      
      // If tradesman, give them a listing too
      if (u.role === 'tradesman') {
        const trade = u.email.includes('carpenter') ? 'Framing' : 'Plumber';
        const listing = {
          tradesmanId: user._id.toString(),
          tradesmanName: user.name,
          tradeType: trade,
          rate: 99,
          serviceAreas: ['NE', 'NW'],
          experience: 10,
          description: `Restored listing for ${user.name}`,
          phone: user.phone,
          email: user.email
        };
        listings.push(listing);
      }
    }

    let userCounter = 1;

    for (const trade of tradeTypes) {
      // Create 2 tradesmen for each trade type
      for (let i = 0; i < 2; i++) {
        const name = `${trade} Pro ${i + 1}`;
        const email = `contact${userCounter}@example.com`;
        
        // Create User
        const user = new User({
          name: name,
          email: email,
          phone: `403-555-${String(userCounter).padStart(4, '0')}`,
          role: 'tradesman'
        });
        
        const savedUser = await user.save();
        console.log(`Created user: ${savedUser.name} (${savedUser.email})`);

        // Create Listing linked to User
        listings.push({
          tradesmanId: savedUser._id.toString(), // Link to real User ID
          tradesmanName: savedUser.name,
          tradeType: trade,
          rate: getRandomInt(50, 120),
          serviceAreas: getRandomAreas(),
          experience: getRandomInt(2, 15),
          description: `Professional ${trade} services by ${savedUser.name}.`,
          phone: savedUser.phone,
          email: savedUser.email
        });

        userCounter++;
      }
    }

    await TradeListing.insertMany(listings);
    console.log(`Seeded ${listings.length} listings linked to users.`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

mongoose.connect(MONGO_URI)
  .then(seedData)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
