const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   userName: { type: String, required: true, unique: true },
   email: { type: String, required: true, unique: true, index: true }, // Added index for better query performance
   password: { type: String, required: true },
   profilePic: { type: String },
   contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('User', userSchema);
