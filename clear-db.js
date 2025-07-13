// Script to clear the database and test fresh
const mongoose = require('mongoose');

async function clearDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/pharmacart');
    console.log('Connected to MongoDB');
    
    // Drop the entire database to clear any cached schemas
    await mongoose.connection.db.dropDatabase();
    console.log('Database cleared successfully');
    
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

clearDatabase();
