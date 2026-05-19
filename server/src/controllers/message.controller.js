const Message = require('../models/Message.model');
const User = require('../models/User.model');
const { sendEmail } = require('../services/email.service');

// POST /api/messages/send
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, applicationId, messageType } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    if (content.trim().length > 2000) {
      return res.status(400).json({ success: false, message: 'Message too long (max 2000 chars).' });
    }

    // Validate receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: 'Recipient not found.' });
    }

    // Prevent self-messaging
    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot send message to yourself.' });
    }

    const message = await Message.create({
      senderId: req.user._id,
      receiverId,
      applicationId: applicationId || undefined,
      content: content.trim(),
      messageType: messageType || 'text',
      senderRole: req.user.role,
    });

    await message.populate('senderId', 'name email role');

    // Email notification to receiver
    sendEmail({
      to: receiver.email,
      templateKey: 'adminMessage',
      templateData: [receiver.name, 'New Message from CBSE Recheck Advisor', content.trim()],
    }).catch(console.error);

    res.status(201).json({ success: true, message: 'Message sent.', data: message });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};

// GET /api/messages/:userId (conversation between current user and userId)
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 50);
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id },
      ],
      isDeleted: false,
    })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate('senderId', 'name email role');

    // Mark messages as read
    await Message.updateMany(
      { senderId: userId, receiverId: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch conversation.' });
  }
};

// GET /api/messages/inbox
exports.getInbox = async (req, res) => {
  try {
    // Get unique conversations
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
          isDeleted: false,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', req.user._id] },
              '$receiverId',
              '$senderId',
            ],
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: { $cond: [{ $and: [{ $eq: ['$receiverId', req.user._id] }, { $eq: ['$isRead', false] }] }, 1, 0] },
          },
        },
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
    ]);

    // Populate user info
    const User = require('../models/User.model');
    const inbox = await Promise.all(
      messages.map(async (m) => {
        const user = await User.findById(m._id).select('name email role');
        return { user, lastMessage: m.lastMessage, unreadCount: m.unreadCount };
      })
    );

    res.status(200).json({ success: true, inbox });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch inbox.' });
  }
};

// GET /api/messages/unread-count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user._id,
      isRead: false,
      isDeleted: false,
    });
    res.status(200).json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get unread count.' });
  }
};
