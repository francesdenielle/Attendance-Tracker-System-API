const mongoose = require('mongoose');

const uri = process.env.DB_URL;

class Database {
    constructor() {
        this._connect();
    }

    async _connect() {
        try {
            await mongoose.connect(uri);
            console.log('MongoDB connection successful');
        } catch (err) {
            console.error('Error connecting to MongoDB: ', err);
        }
    }

    isConnected() {
        try {
            return mongoose.connection.readyState === 1;
        } catch (err) {
            console.error('Error checking MongoDB connection state:', err);
            return false; // Or throw an error
        }
    }

    async closeConnection() {
        try {
          await mongoose.connection.close();
          console.log('MongoDB connection closed');
        } catch (err) {
          console.error('Error closing MongoDB connection:', err);
        }
    }
}

module.exports = Database;