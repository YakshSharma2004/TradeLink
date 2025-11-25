// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String,   // store the user id as string for simplicity
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Message', messageSchema);
