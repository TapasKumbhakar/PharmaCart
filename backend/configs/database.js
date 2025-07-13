const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB connection string - you can change this to your MongoDB Atlas URL if needed
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmacart';
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
