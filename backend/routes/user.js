const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login / Register (Upsert)
router.post('/login', async (req, res) => {
    const { userId, name } = req.body;
    if (!userId || !name) return res.status(400).json({ error: 'Missing fields' });

    try {
        let user = await User.findOne({ userId });
        if (user) {
            user.name = name; // Update name if changed
            user.online = true;
            await user.save();
        } else {
            user = await User.create({ userId, name, online: true });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User by ID
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
