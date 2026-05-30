const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header first, then cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. Please login.' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
      }
      return res.status(401).json({ success: false, message: 'Invalid token. Please login again.' });
    }

    // Find user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: 'Email not verified. Please verify your email.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ success: false, message: 'Authentication error.' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
  }
  next();
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  };

  res.cookie('token', token, cookieOptions);

  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.otp;

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: userObj._id,
      name: userObj.name,
      email: userObj.email,
      rollNo: userObj.rollNo,
      stream: userObj.stream,
      role: userObj.role,
      isVerified: userObj.isVerified,
      referralCode: userObj.referralCode,
      referralCount: userObj.referralCount,
    },
  });
};

module.exports = { protect, adminOnly, generateToken, sendTokenResponse };
