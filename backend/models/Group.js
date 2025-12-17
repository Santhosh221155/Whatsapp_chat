const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    groupId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    members: [{
        type: String // userId
    }],
    admins: [{
        type: String // userId
    }],
}, { timestamps: true });

module.exports = mongoose.model('Group', GroupSchema);
