// routes/tradeListingRoutes.js
const express = require('express');
const TradeListing = require('../models/tadelistings');

const router = express.Router();

// GET /api/trade-listings
router.get('/', async (req, res) => {
  try {
    const { tradeType, area, minRate, maxRate, tradesmanId, email } = req.query;

    const filter = {};

    if (tradeType) filter.tradeType = tradeType;
    if (tradesmanId) filter.tradesmanId = tradesmanId;
    if (email) filter.email = email;
    if (area) filter.serviceAreas = area; // matches docs where array contains this area

    if (minRate || maxRate) {
      filter.rate = {};
      if (minRate) filter.rate.$gte = Number(minRate);
      if (maxRate) filter.rate.$lte = Number(maxRate);
    }

    const listings = await TradeListing.find(filter).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch trade listings' });
  }
});

// GET /api/trade-listings/:id
router.get('/:id', async (req, res) => {
  try {
    const listing = await TradeListing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (err) {
    res.status(400).json({ error: 'Invalid id' });
  }
});

// POST /api/trade-listings
router.post('/', async (req, res) => {
  try {
    const listing = new TradeListing(req.body);
    const saved = await listing.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create listing' });
  }
});

// PATCH /api/trade-listings/:id
router.patch('/:id', async (req, res) => {
  try {
    const updated = await TradeListing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update listing' });
  }
});

// DELETE /api/trade-listings/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await TradeListing.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete listing' });
  }
});

module.exports = router;
