const Application = require('../models/Application.model');
const Payment = require('../models/Payment.model');
const User = require('../models/User.model');
const Message = require('../models/Message.model');
const { sendEmail } = require('../services/email.service');
const { deleteFile } = require('../services/cloudinary.service');
const { Parser } = require('json2csv');

// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [
      totalApplications, totalUsers, pendingApplications, completedApplications,
      totalRevenueResult, recentApplications, recentPayments, allUsers, allApplications
    ] = await Promise.all([
      Application.countDocuments({ isDeleted: false }),
      User.countDocuments({ role: 'user' }),
      Application.countDocuments({ isDeleted: false, status: { $in: ['submitted', 'payment_verified'] } }),
      Application.countDocuments({ isDeleted: false, status: { $in: ['recommendation_ready', 'completed'] } }),
      Payment.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Application.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(10).populate('userId', 'name email'),
      Payment.find({ status: 'paid' }).sort({ createdAt: -1 }).limit(10).populate('userId', 'name email'),
      User.find({ role: 'user' }).select('email _id'),
      Application.find({ isDeleted: false }).select('studentEmail userId paymentStatus'),
    ]);

    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const applicantUserIds = new Set(allApplications.map(a => a.userId?.toString()).filter(Boolean));
    const loginNotInitiate = allUsers
      .filter(u => !applicantUserIds.has(u._id.toString()))
      .map(u => u.email)
      .filter(Boolean);

    const paidEmails = allApplications
      .filter(a => a.paymentStatus === 'paid')
      .map(a => a.studentEmail)
      .filter(Boolean);

    const initiatedNotPaidEmails = allApplications
      .filter(a => a.paymentStatus !== 'paid')
      .map(a => a.studentEmail)
      .filter(Boolean);

    res.status(200).json({
      success: true,
      stats: { totalApplications, totalUsers, pendingApplications, completedApplications, totalRevenue },
      recentApplications,
      recentPayments,
      emailLists: {
        loginNotInitiate: [...new Set(loginNotInitiate)],
        paid: [...new Set(paidEmails)],
        initiatedNotPaid: [...new Set(initiatedNotPaidEmails)],
      }
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data.' });
  }
};

// GET /api/admin/applications
exports.getAllApplications = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(10000, parseInt(req.query.limit) || 1000);
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    // Search
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { requestId: searchRegex },
        { studentName: searchRegex },
        { studentEmail: searchRegex },
        { rollNo: searchRegex },
      ];
    }

    const sortField = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email rollNo'),
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

// GET /api/admin/applications/:id
exports.getApplicationDetail = async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, isDeleted: false })
      .populate('userId', 'name email rollNo stream createdAt');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found.' });

    const payment = await Payment.findOne({ applicationId: application._id });
    const messages = await Message.find({ applicationId: application._id }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, application, payment, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch application details.' });
  }
};

// PATCH /api/admin/applications/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const validStatuses = ['submitted', 'payment_verified', 'under_review', 'recommendation_ready', 'completed', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const update = { status, reviewedBy: req.user._id };
    if (adminNotes) update.adminNotes = adminNotes.substring(0, 2000);
    if (status === 'completed') update.completedAt = new Date();

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      update,
      { returnDocument: 'after' }
    ).populate('userId', 'name email');

    if (!application) return res.status(404).json({ success: false, message: 'Application not found.' });

    // Notify student
    if (status === 'recommendation_ready') {
      sendEmail({
        to: application.userId.email,
        templateKey: 'recommendationReady',
        templateData: [application.userId.name, application.requestId],
      }).catch(console.error);
    }

    res.status(200).json({ success: true, message: 'Status updated successfully.', application });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
};

// PATCH /api/admin/applications/:id/recommendation
exports.sendRecommendation = async (req, res) => {
  try {
    const { recommendation } = req.body;
    if (!recommendation || recommendation.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Recommendation must be at least 10 characters.' });
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        recommendation: recommendation.trim().substring(0, 5000),
        status: 'recommendation_ready',
        reviewedBy: req.user._id,
      },
      { returnDocument: 'after' }
    ).populate('userId', 'name email');

    if (!application) return res.status(404).json({ success: false, message: 'Application not found.' });

    sendEmail({
      to: application.userId.email,
      templateKey: 'recommendationReady',
      templateData: [application.userId.name, application.requestId],
    }).catch(console.error);

    res.status(200).json({ success: true, message: 'Recommendation sent successfully.', application });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send recommendation.' });
  }
};

// DELETE /api/admin/applications/:id
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { returnDocument: 'after' }
    );
    if (!application) return res.status(404).json({ success: false, message: 'Application not found.' });

    res.status(200).json({ success: true, message: 'Application deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete application.' });
  }
};

// GET /api/admin/applications/export
exports.exportCSV = async (req, res) => {
  try {
    const applications = await Application.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .select('requestId studentName studentEmail studentMobile rollNo stream subjects paymentAmount paymentStatus status createdAt');

    const csvData = applications.map(app => ({
      'Request ID': app.requestId,
      'Student Name': app.studentName,
      'Email': app.studentEmail,
      'Mobile': app.studentMobile || '',
      'Roll No': app.rollNo,
      'Stream': app.stream,
      'Subjects': app.subjects.map(s => `${s.subject}(${s.currentMarks})`).join('; '),
      'Amount (₹)': app.paymentAmount,
      'Payment': app.paymentStatus,
      'Status': app.status,
      'Date': new Date(app.createdAt).toLocaleDateString('en-IN'),
    }));

    const parser = new Parser();
    const csv = parser.parse(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="applications_${Date.now()}.csv"`);
    res.status(200).send(csv);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to export data.' });
  }
};

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(10000, parseInt(req.query.limit) || 1000);
    const skip = (page - 1) * limit;

    const filter = { role: 'user' };
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }, { rollNo: searchRegex }];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-password'),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      users,
      pagination: { total, page, pages: Math.ceil(total / limit), limit },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
};
