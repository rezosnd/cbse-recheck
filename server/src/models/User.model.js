const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [60, 'Name cannot exceed 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  rollNo: {
    type: String,
    trim: true,
    default: '',
  },
  stream: {
    type: String,
    enum: ['Science', 'Commerce', 'Arts', 'Other', ''],
    default: '',
  },
  password: {
    type: String,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  referralCount: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    code: { type: String, select: false },
    expiresAt: { type: Date, select:false },
    attempts: { type: Number, default: 0, select: false },
  },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpire: { type: Date, select: false },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    attempts: 0,
  };
  return otp;
};

module.exports = mongoose.model('User', userSchema);
