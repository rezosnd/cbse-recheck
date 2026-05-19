const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment.model');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

// GET /api/payments/history
router.get('/history', async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id, status: 'paid' })
      .sort({ createdAt: -1 })
      .populate('applicationId', 'requestId subjects status');
    res.status(200).json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch payment history.' });
  }
});

// GET /api/payments/:id
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('applicationId', 'requestId subjects status');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found.' });
    res.status(200).json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch payment.' });
  }
});

module.exports = router;
