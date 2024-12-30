// const groupSchema = new mongoose.Schema({
//    name: { type: String, required: true },
//    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// });

// module.exports = mongoose.model('Group', groupSchema);

const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
   name: { type: String, required: true },
   admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Group', GroupSchema);
