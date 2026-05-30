require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model.js');

const generateReferralCode = async (name) => {
  const prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '') || 'USR';
  let code;
  let isUnique = false;
  while (!isUnique) {
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    code = prefix + random;
    const existingUser = await User.findOne({ referralCode: code });
    if (!existingUser) isUnique = true;
  }
  return code;
};

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const users = await User.find({});
  let count = 0;
  for (const user of users) {
    if (!user.referralCode) {
      user.referralCode = await generateReferralCode(user.name);
      await user.save();
      console.log('Updated user:', user.email, 'with code:', user.referralCode);
      count++;
    }
  }
  console.log('Done migrating ' + count + ' users!');
  process.exit(0);
}).catch(console.error);
