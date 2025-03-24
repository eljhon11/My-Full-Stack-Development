const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   PUT api/auth/update
// @desc    Update user profile
// @access  Private
router.put('/update', auth, async (req, res) => {
    try {
        const { name } = req.body;
        
        // Simple validation
        if (!name) {
            return res.status(400).json({ msg: 'Name is required' });
        }
        
        // Find and update user
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { name } },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

