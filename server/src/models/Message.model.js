const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
    trim: true,
  },
  messageType: {
    type: String,
    enum: ['text', 'update', 'file_request', 'system'],
    default: 'text',
  },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  senderRole: { type: String, enum: ['student', 'admin'], required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
messageSchema.index({ applicationId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
