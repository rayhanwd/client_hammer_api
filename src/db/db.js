const mongoose = require('mongoose');
const { db } = require('../config/config');

const dbURL = db.db_uri;
if (!dbURL) {
    console.error("There is no MongoDB URL set in the environment file or config.js");
}

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const dbConnection = mongoose.connection;

dbConnection.on('error', (error) => {
    console.error('Failed to connect using Mongoose:', error);
});

dbConnection.once('open', () => {
    console.info('Connected to the MongoDB server');
});
