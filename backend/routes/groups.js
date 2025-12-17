const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

// Create Group
router.post('/create', async (req, res) => {
    const { groupId, name, members, adminId } = req.body;
    try {
        const group = await Group.create({ groupId, name, members, admins: [adminId] });
        res.json(group);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Groups for User
router.get('/:userId', async (req, res) => {
    try {
        const groups = await Group.find({ members: req.params.userId });
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
