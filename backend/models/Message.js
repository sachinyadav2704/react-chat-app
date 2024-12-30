const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
   receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
   chatroom: { type: String, required: true }, // global, private user-user, or group ID
   sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   senderName: { type: String, required: true },
   content: { type: String, required: true },
   timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', MessageSchema);
