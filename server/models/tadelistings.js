// models/TradeListing.js
const mongoose = require('mongoose');

const tradeListingSchema = new mongoose.Schema({
  tradesmanId: {
    type: String,        // keep as string to match existing data for now
    required: true,
  },
  tradesmanName: String,
  tradeType: { type: String, required: true },
  rate: { type: Number, required: true },
  rateUnit: { type: String, default: 'per hour' },
  serviceAreas: [
    {
      type: String,
      enum: ['NE', 'NW', 'SE', 'SW'],
    },
  ],
  experience: Number,
  description: String,
  phone: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TradeListing', tradeListingSchema);
