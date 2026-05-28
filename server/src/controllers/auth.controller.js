const User = require('../models/User.model');
const { sendEmail } = require('../services/email.service');
const { sendTokenResponse } = require('../middleware/auth.middleware');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: check if an email is in the admin list
const isAdminEmail = (email) => {
  const list = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
};


// POST /api/auth/google – Google Login
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Verify Google Token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, email_verified } = payload;
    
    if (!email_verified) {
      return res.status(403).json({ success: false, message: 'Google email is not verified.' });
    }

    let user = await User.findOne({ email });

    // If user doesn't exist, tell frontend to ask for details
    if (!user) {
      return res.status(200).json({
        success: true,
        requireDetails: true,
        googleData: { email, name, credential }
      });
    }

    if (isAdminEmail(user.email) && user.role !== 'admin') {
      user.role = 'admin';
    }

    user.isVerified = true;
    user.lastLogin = new Date();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ success: false, message: 'Google authentication failed.' });
  }
};

// POST /api/auth/google-register – Complete Google Registration
exports.googleRegister = async (req, res) => {
  try {
    const { credential, rollNo, stream } = req.body;
    
    // Verify Google Token again to strictly ensure authenticity
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { email, name } = ticket.getPayload();
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists. Please login.' });
    }

    user = new User({
      name,
      email,
      isVerified: true,
      stream: stream || 'Science',
      rollNo: rollNo || '',
      role: isAdminEmail(email) ? 'admin' : 'user',
    });

    user.lastLogin = new Date();
    await user.save();
    
    // Attempt sending welcome email silently
    sendEmail({ to: email, templateKey: 'welcome', templateData: [name] }).catch(() => {});

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Google register error:', err);
    res.status(500).json({ success: false, message: 'Registration failed.' });
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-otp -password');
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch user data.' });
  }
};

// PUT /api/auth/update-profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, rollNo, stream } = req.body;
    const allowedFields = {};
    if (name) allowedFields.name = name.trim().substring(0, 60);
    if (rollNo !== undefined) allowedFields.rollNo = rollNo.trim().substring(0, 20);
    if (stream) allowedFields.stream = stream;

    const user = await User.findByIdAndUpdate(req.user._id, allowedFields, {
      returnDocument: 'after',
      runValidators: true,
      select: '-otp -password',
    });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};
