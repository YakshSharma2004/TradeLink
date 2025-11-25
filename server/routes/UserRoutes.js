// routes/userRoutes.js
const express = require('express');
const User = require('../models/User');

const router = express.Router();

const toUserDto = (user) => ({
  id: user._id.toString(),   // matches frontend User.id
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  createdAt: user.createdAt,
});

// GET /api/users?role=builder&search=john
router.get('/', async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = {};

    if (role) filter.role = role;

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json(users.map(toUserDto));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(toUserDto(user));
  } catch (err) {
    res.status(400).json({ error: 'Invalid user id' });
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;

    const user = new User({ name, email, phone, role });
    const saved = await user.save();

    res.status(201).json(toUserDto(saved));
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create user' });
  }
});

// PATCH /api/users/:id
router.patch('/:id', async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role },
      { new: true, runValidators: true },
    );

    if (!updated) return res.status(404).json({ error: 'User not found' });

    res.json(toUserDto(updated));
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id  (optional, but handy for cleaning test data)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
