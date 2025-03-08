const mongoose = require('mongoose');

const ChatroomSchema = new mongoose.Schema({
   name: { type: String, required: true },
   type: { type: String, enum: ['global', 'private', 'group'], required: true },
   participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // For group chatrooms
   password: { type: String }, // For private chatrooms
   createdAt: { type: Date, default: Date.now, index: true }, // Added index for better query performance
});

module.exports = mongoose.model('ChatRoom', ChatroomSchema);
