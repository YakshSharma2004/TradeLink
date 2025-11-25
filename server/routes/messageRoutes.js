// routes/messageRoutes.js
const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

const toMessageDto = (msg) => ({
  id: msg._id.toString(),
  senderId: msg.senderId,
  senderName: msg.senderName,
  receiverId: msg.receiverId,
  receiverName: msg.receiverName,
  message: msg.message,
  timestamp: msg.timestamp,
  read: msg.read,
});

// GET /api/messages?userId=...&otherUserId=...
// - both given → conversation between two users
// - only userId → all messages where user is sender or receiver
router.get('/', async (req, res) => {
  try {
    const { userId, otherUserId } = req.query;

    if (!userId && !otherUserId) {
      return res
        .status(400)
        .json({ error: 'Provide at least userId or otherUserId' });
    }

    const filter = {};

    if (userId && otherUserId) {
      filter.$or = [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ];
    } else if (userId) {
      filter.$or = [{ senderId: userId }, { receiverId: userId }];
    } else if (otherUserId) {
      filter.$or = [{ senderId: otherUserId }, { receiverId: otherUserId }];
    }

    const messages = await Message.find(filter).sort({ timestamp: 1 });
    res.json(messages.map(toMessageDto));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// GET /api/messages/conversations?userId=123
// Returns one entry per other user: last message + unread count
router.get('/conversations', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ timestamp: 1 });

    const convMap = new Map();

    for (const msg of messages) {
      const isSender = msg.senderId === userId;
      const otherUserId = isSender ? msg.receiverId : msg.senderId;
      const otherUserName = isSender ? msg.receiverName : msg.senderName;

      const existing = convMap.get(otherUserId);
      const unreadIncrement =
        !msg.read && msg.receiverId === userId ? 1 : 0;

      if (!existing) {
        convMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUserName,
          lastMessage: msg.message,
          lastMessageTime: msg.timestamp,
          unreadCount: unreadIncrement,
        });
      } else {
        // update last message if this one is newer
        if (msg.timestamp > existing.lastMessageTime) {
          existing.lastMessage = msg.message;
          existing.lastMessageTime = msg.timestamp;
        }
        existing.unreadCount += unreadIncrement;
      }
    }

    res.json(Array.from(convMap.values()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// POST /api/messages
router.post('/', async (req, res) => {
  try {
    const {
      senderId,
      senderName,
      receiverId,
      receiverName,
      message,
      timestamp,
    } = req.body;

    const msg = new Message({
      senderId,
      senderName,
      receiverId,
      receiverName,
      message,
      timestamp: timestamp ? new Date(timestamp) : undefined,
    });

    const saved = await msg.save();
    
    // Emit socket event if io is available (it's not directly accessible here unless passed)
    // Ideally, we should have a controller or pass io to routes.
    // For now, the client emits the socket event too, or we can just rely on polling/refresh if socket fails.
    // But wait, server/index.js sets up io. 
    // We can attach io to req in middleware in index.js!
    
    if (req.io) {
        req.io.to(receiverId).emit('receive_message', toMessageDto(saved));
        // Also emit to sender for confirmation/sync across devices
        req.io.to(senderId).emit('receive_message', toMessageDto(saved));
    }

    res.status(201).json(toMessageDto(saved));
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create message' });
  }
});

// PATCH /api/messages/:id  (e.g. mark as read)
router.patch('/:id', async (req, res) => {
  try {
    const { read } = req.body;

    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { read },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(toMessageDto(updated));
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update message' });
  }
});

module.exports = router;
