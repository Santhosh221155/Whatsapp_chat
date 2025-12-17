const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

console.log("Attempting to connect to MongoDB...");

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('SUCCESS: MongoDB Connection Established!');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE: MongoDB Connection Error:', err);
        process.exit(1);
    });
