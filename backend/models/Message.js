const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
   receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
   chatroom: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true }, // Reference to ChatRoom
   sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   senderName: { type: String, required: true },
   content: { type: String, required: true },
   timestamp: { type: Date, default: Date.now, index: true }, // Added index for better query performance
});

module.exports = mongoose.model('Message', MessageSchema);
