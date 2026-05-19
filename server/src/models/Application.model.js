const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const subjectMarkSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  currentMarks: { type: Number, required: true, min: 0, max: 100 },
  expectedMarks: { type: Number, min: 0, max: 100 },
}, { _id: false });

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  requestId: {
    type: String,
    unique: true,
    default: () => {
      const num = Math.floor(1000 + Math.random() * 9000);
      const year = new Date().getFullYear();
      return `RCHK-${year}-${num}`;
    },
  },
  studentName: { type: String, required: true, trim: true },
  studentEmail: { type: String, required: true, lowercase: true },
  studentMobile: { type: String, required: true },
  rollNo: { type: String, trim: true },
  stream: { type: String, enum: ['Science', 'Commerce', 'Arts', 'Other', ''] },
  subjects: {
    type: [subjectMarkSchema],
    required: true,
    validate: [arr => arr.length > 0, 'At least one subject is required'],
  },
  reason: {
    type: String,
    required: [true, 'Reason for recheck is required'],
    minlength: [20, 'Reason must be at least 20 characters'],
    maxlength: [1000, 'Reason cannot exceed 1000 characters'],
  },
  uploadedFiles: [{
    fileType: { type: String, enum: ['marksheet', 'answerSheet', 'supporting'] },
    fileUrl: { type: String, required: true },
    publicId: { type: String },
    fileName: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  }],
  paymentAmount: { type: Number, default: 0 },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentId: { type: String },
  orderId: { type: String },
  status: {
    type: String,
    enum: ['submitted', 'payment_verified', 'under_review', 'recommendation_ready', 'completed', 'rejected'],
    default: 'submitted',
    index: true,
  },
  recommendation: {
    type: String,
    default: '',
    maxlength: [5000, 'Recommendation cannot exceed 5000 characters'],
  },
  adminNotes: {
    type: String,
    default: '',
    maxlength: [2000, 'Admin notes cannot exceed 2000 characters'],
  },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date },
  completedAt: { type: Date },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Indexes
applicationSchema.index({ userId: 1, createdAt: -1 });
applicationSchema.index({ status: 1, isDeleted: 1 });

module.exports = mongoose.model('Application', applicationSchema);
