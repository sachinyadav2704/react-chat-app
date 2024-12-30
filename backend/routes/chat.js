const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages for a specific chatroom
router.get('/:chatroomId', async (req, res) => {
   const { chatroomId } = req.params;
   try {
      const messages = await Message.find({ chatroom: chatroomId }).sort({ timestamp: 1 });
      res.json(messages);
   } catch (error) {
      res.status(500).json({ error: 'Error fetching messages' });
   }
});

module.exports = router;
