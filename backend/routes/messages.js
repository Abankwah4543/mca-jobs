const express = require('express');
const router = express.Router();
const { Conversation, Message } = require('../models/Message');
const User = require('../models/User');
const MCAProfile = require('../models/MCAProfile');
const EmployerProfile = require('../models/EmployerProfile');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

// @desc    Get or create conversation
// @route   GET /api/messages/conversation/:userId
// @access  Private
router.get('/conversation/:userId', async (req, res) => {
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, req.params.userId] }
    }).populate('lastMessage').populate('participants', 'email profile role');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, req.params.userId]
      });
      conversation = await conversation.populate('participants', 'email profile role');
    }

    const messages = await Message.find({ conversation: conversation._id })
      .populate('sender', 'email profile')
      .sort('createdAt')
      .limit(50);

    res.json({
      success: true,
      data: { conversation, messages }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get all conversations for user
// @route   GET /api/messages/conversations
// @access  Private
router.get('/conversations', async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
      .populate('participants', 'email profile role')
      .populate('lastMessage')
      .sort('-updatedAt');

    res.json({
      success: true,
      count: conversations.length,
      data: { conversations }
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Send message
// @route   POST /api/messages/send
// @access  Private
router.post('/send', upload.array('attachments', 3), async (req, res) => {
  try {
    const { conversationId, content, recipientId } = req.body;

    if (!content && !req.files?.length) {
      return res.status(400).json({
        success: false,
        message: 'Message content or attachment is required'
      });
    }

    let conversation = conversationId 
      ? await Conversation.findById(conversationId)
      : await Conversation.findOne({
          participants: { $all: [req.user.id, recipientId] }
        });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, recipientId]
      });
    }

    const attachments = req.files?.map(file => ({
      filename: file.originalname,
      path: file.path,
      fileType: file.mimetype,
      size: file.size
    })) || [];

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user.id,
      content,
      attachments
    });

    // Update last message
    conversation.lastMessage = message._id;
    await conversation.save();

    // Populate sender info
    await message.populate('sender', 'email profile');

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: { message }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Mark messages as read
// @route   PUT /api/messages/:conversationId/read
// @access  Private
router.put('/:conversationId/read', async (req, res) => {
  try {
    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        sender: { $ne: req.user.id },
        read: false
      },
      {
        read: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get unread count
// @route   GET /api/messages/unread-count
// @access  Private
router.get('/unread-count', async (req, res) => {
  try {
    const count = await Message.countDocuments({
      conversation: {
        $in: await Conversation.find({ participants: req.user.id }).distinct('_id')
      },
      sender: { $ne: req.user.id },
      read: false
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
