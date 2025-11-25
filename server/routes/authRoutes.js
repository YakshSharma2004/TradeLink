const express = require('express');
const User = require('../models/User');
const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, phone, role } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }
        
        const user = new User({ name, email, phone, role });
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
    const { email, role } = req.body;
    console.log(`Login attempt for email: ${email}, role: ${role}`);
    
    // Efficiently check both email and role in the database query
    const user = await User.findOne({ email, role });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found or role does not match' });
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