const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/CHATBOT';  // Use consistent DB name

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => console.error('❌ MongoDB connection error:', err));
db.once('open', () => console.log('✅ MongoDB connected'));

module.exports = mongoose;
