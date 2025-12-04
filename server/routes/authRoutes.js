const express = require('express');
const User = require('../models/User');
const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, phone, role, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }
        
        const user = new User({ name, email, phone, role, password });
        await user.save();
        
        return res.status(201).json({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(400).json({ error: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, role, password } = req.body;
    
    // Check if user exists with email first
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Check if role matches
    if (user.role !== role) {
        return res.status(401).json({ error: `Please login as a ${user.role}` });
    }

    // Check if password matches
    if (user.password !== password) {
        return res.status(401).json({ error: 'Incorrect password' });
    }
    
    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({ error: 'Login failed' });
  }
});

module.exports = router;