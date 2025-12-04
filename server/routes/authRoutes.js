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

      role: user.role
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({ error: 'Login failed' });
  }
});

module.exports = router;