require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL, role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin already exists:', existingAdmin.email);
      process.exit(0);
    }

    const admin = await User.create({
      name: 'CBSE Admin',
      email: process.env.ADMIN_EMAIL || 'admin@cbserechechadvisor.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123!',
      role: 'admin',
      isVerified: true,
      rollNo: '',
      stream: '',
    });

    // OTP bypass for admin
    admin.otp = { code: undefined, expiresAt: undefined, attempts: 0 };
    await admin.save();

    console.log('✅ Admin user created:', admin.email);
    console.log('🔑 Login with: POST /api/auth/admin-login');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedAdmin();
