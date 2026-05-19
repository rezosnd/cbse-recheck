const express = require('express');
const router = express.Router();
const { sendMessage, getConversation, getInbox, getUnreadCount } = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/inbox', getInbox);
router.get('/unread-count', getUnreadCount);
router.post('/send', sendMessage);
router.get('/:userId', getConversation);

module.exports = router;
