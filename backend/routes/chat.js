const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages for a specific chatroom
router.get('/:chatroomId', async (req, res) => {
   const { chatroomId } = req.params;
   try {
      // Validate chatroomId
      if (!chatroomId) {
         return res.status(400).json({ error: 'Chatroom ID is required' });
      }

      const messages = await Message.find({ chatroom: chatroomId }).sort({ timestamp: 1 });
      res.json(messages);
   } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Error fetching messages' });
   }
});

// Get messages for the global chatroom
router.get('/global', async (req, res) => {
   try {
      const messages = await Message.find({ chatroom: 'global' }).sort({ timestamp: 1 });
      res.json(messages);
   } catch (error) {
      console.error('Error fetching global messages:', error);
      res.status(500).json({ error: 'Error fetching global messages' });
   }
});

// Post a new message to a specific chatroom
router.post('/:chatroomId', async (req, res) => {
   const { chatroomId } = req.params;
   const { sender, senderName, content } = req.body;
   try {
      // Validate input
      if (!chatroomId || !sender || !senderName || !content) {
         return res.status(400).json({ error: 'All fields are required' });
      }

      const newMessage = new Message({
         chatroom: chatroomId,
         sender,
         senderName,
         content,
      });

      await newMessage.save();
      res.status(200).json(newMessage);
   } catch (error) {
      console.error('Error posting message:', error);
      res.status(500).json({ error: 'Error posting message' });
   }
});

// Post a new message to the global chatroom
router.post('/global', async (req, res) => {
   const { sender, senderName, content } = req.body;
   try {
      // Validate input
      if (!sender || !senderName || !content) {
         return res.status(400).json({ error: 'All fields are required' });
      }

      const newMessage = new Message({
         chatroom: 'global',
         sender,
         senderName,
         content,
      });

      await newMessage.save();
      res.status(200).json(newMessage);
   } catch (error) {
      console.error('Error posting global message:', error);
      res.status(500).json({ error: 'Error posting global message' });
   }
});

module.exports = router;
