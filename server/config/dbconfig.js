const mongoose = require('mongoose');

const connect = mongoose.connect(process.env.MONGO_URL)

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('MongoDB connected');
})

connection.on('error', (err) => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
})

module.exports = mongoose;