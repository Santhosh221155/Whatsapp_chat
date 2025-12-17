const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get Chat History
router.get('/:userId/:otherId', async (req, res) => {
    const { userId, otherId } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: otherId },
                { senderId: otherId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark messages as read
router.post('/read', async (req, res) => {
    const { senderId, receiverId } = req.body;
    try {
        await Message.updateMany(
            { senderId, receiverId, status: { $ne: 'read' } },
            { $set: { status: 'read' } }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
