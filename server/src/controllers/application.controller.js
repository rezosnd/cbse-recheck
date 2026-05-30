const Application = require('../models/Application.model');
const Payment = require('../models/Payment.model');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendEmail } = require('../services/email.service');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Calculate price based on subject count
const calculatePrice = (subjectCount) => {
  if (subjectCount === 1) return 59;
  if (subjectCount === 2) return 99;
  if (subjectCount >= 3) return 149;
  return 0;
};

// POST /api/applications – Create application & Razorpay order
exports.createApplication = async (req, res) => {
  try {
    const { subjects, reason, rollNo, stream, studentMobile } = req.body;
    const user = req.user;

    if (!studentMobile || studentMobile.length < 10) {
      return res.status(400).json({ success: false, message: 'Valid mobile number is required.' });
    }

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one subject is required.' });
    }

    // Validate subjects
    for (const s of subjects) {
      if (!s.subject || typeof s.currentMarks !== 'number' || s.currentMarks < 0 || s.currentMarks > 100) {
        return res.status(400).json({ success: false, message: 'Invalid subject data.' });
      }
    }

    const amount = calculatePrice(subjects.length);
    const amountInPaise = amount * 100;

    // Create Razorpay order
    const receiptId = `rcpt_${Date.now()}`;
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: { userId: user._id.toString(), email: user.email },
    });

    // Create application
    const application = await Application.create({
      userId: user._id,
      studentName: user.name,
      studentEmail: user.email,
      studentMobile: studentMobile,
      rollNo: rollNo || user.rollNo || '',
      stream: stream || user.stream || '',
      subjects,
      reason: reason.trim(),
      paymentAmount: amount,
      paymentStatus: 'pending',
      orderId: razorpayOrder.id,
      status: 'submitted',
    });

    // Create payment record
    await Payment.create({
      userId: user._id,
      applicationId: application._id,
      requestId: application.requestId,
      orderId: razorpayOrder.id,
      amount,
      currency: 'INR',
      receipt: receiptId,
      status: 'created',
    });

    res.status(201).json({
      success: true,
      application: {
        _id: application._id,
        requestId: application.requestId,
        status: application.status,
        paymentAmount: amount,
      },
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Create application error:', err);
    res.status(500).json({ success: false, message: 'Failed to create application.' });
  }
};

// POST /api/applications/verify-payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, applicationId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !applicationId) {
      return res.status(400).json({ success: false, message: 'Missing payment verification data.' });
    }

    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
    }

    // Update application
    const application = await Application.findOneAndUpdate(
      { _id: applicationId, userId: req.user._id, paymentStatus: 'pending' },
      {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        status: 'payment_verified',
      },
      { returnDocument: 'after' }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found or already paid.' });
    }

    // Update payment record
    await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { paymentId: razorpay_payment_id, signature: razorpay_signature, status: 'paid' }
    );

    // Send confirmation email
    const subjectNames = application.subjects.map(s => s.subject);
    sendEmail({
      to: req.user.email,
      templateKey: 'paymentConfirmation',
      templateData: [req.user.name, application.requestId, application.paymentAmount, subjectNames],
    }).catch(console.error);

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully!',
      application: {
        _id: application._id,
        requestId: application.requestId,
        status: application.status,
      },
    });
  } catch (err) {
    console.error('Payment verify error:', err);
    res.status(500).json({ success: false, message: 'Payment verification failed.' });
  }
};

// GET /api/applications – Get user's applications
exports.getMyApplications = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = { userId: req.user._id, isDeleted: false };
    if (req.query.status) filter.status = req.query.status;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-adminNotes'),
      Application.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      applications,
      pagination: { total, page, pages: Math.ceil(total / limit), limit },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch applications.' });
  }
};

// GET /api/applications/:id
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false,
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    res.status(200).json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch application.' });
  }
};

// POST /api/applications/:id/upload-files
exports.uploadFiles = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false,
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded.' });
    }

    const fileType = req.body.fileType || 'supporting';
    const allowedTypes = ['marksheet', 'answerSheet', 'supporting'];
    if (!allowedTypes.includes(fileType)) {
      return res.status(400).json({ success: false, message: 'Invalid file type.' });
    }

    const newFiles = req.files.map(file => ({
      fileType,
      fileUrl: file.path || file.secure_url,
      publicId: file.filename || file.public_id,
      fileName: file.originalname,
      subject: req.body.subject,
    }));

    application.uploadedFiles.push(...newFiles);
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully.',
      files: newFiles,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: 'File upload failed.' });
  }
};

// GET /api/applications/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const [total, pending, underReview, completed, payments] = await Promise.all([
      Application.countDocuments({ userId, isDeleted: false }),
      Application.countDocuments({ userId, isDeleted: false, status: { $in: ['submitted', 'payment_verified'] } }),
      Application.countDocuments({ userId, isDeleted: false, status: 'under_review' }),
      Application.countDocuments({ userId, isDeleted: false, status: { $in: ['recommendation_ready', 'completed'] } }),
      Payment.find({ userId, status: 'paid' }).sort({ createdAt: -1 }).limit(5),
    ]);

    res.status(200).json({
      success: true,
      stats: { total, pending, underReview, completed },
      recentPayments: payments,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
  }
};
