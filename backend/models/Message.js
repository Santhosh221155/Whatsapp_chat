const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String, // Can be user ID or Group ID
        required: true
    },
    content: {
        type: String,
        required: true
    },
    groupId: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
