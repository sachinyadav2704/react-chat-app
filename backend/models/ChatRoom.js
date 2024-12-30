const mongoose = require('mongoose');

const ChatroomSchema = new mongoose.Schema({
   name: { type: String, required: true },
   type: { type: String, enum: ['global', 'private', 'group'], required: true },
   participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // For private or group chatrooms
   createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chatroom', ChatroomSchema);