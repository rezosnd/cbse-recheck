const mongoose = require('mongoose');
const User = require('../models/User.model');
require('dotenv').config({ path: '../.env' });

const deleteUsers = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI not found in .env file. Make sure the script is run from the server/scripts directory.');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for user deletion script.');

    console.log('Deleting all users...');
    const result = await User.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} users.`);
    
    mongoose.disconnect();
    console.log('MongoDB disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('Error deleting users:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

deleteUsers();
