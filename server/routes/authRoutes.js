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
    console.log('Login attempt details:', { email, role, password });
    
    // Efficiently check email, role AND password in the database query
    const user = await User.findOne({ email, role, password });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      // Debug: Check if user exists with just email
      const userByEmail = await User.findOne({ email });
      console.log('User found by email only:', userByEmail ? 'Yes' : 'No');
      if (userByEmail) {
        console.log('Stored role:', userByEmail.role);
        console.log('Stored password:', userByEmail.password);
        console.log('Provided role:', role);
        console.log('Provided password:', password);
      }
      
      return res.status(404).json({ error: 'User not found or details do not match' });
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