const mongoose = require('mongoose')

const db = (MONGODB_URI) => {
  mongoose
    .connect(MONGODB_URI, {})
    .then(() => console.log('Connected to Database'))
    .catch((err) => console.error('Database connection error:', err));
};

module.exports = { db }