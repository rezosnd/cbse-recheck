const express = require('express');
const router = express.Router();
const { googleLogin, googleRegister, logout, getMe, updateProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/google', googleLogin);
router.post('/google-register', googleRegister);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

module.exports = router;
