const express = require('express');
const Chatroom = require('../models/ChatRoom');
const router = express.Router();

// Get all chatrooms
router.get('/', async (req, res) => {
   try {
      const chatrooms = await Chatroom.find();
      res.json(chatrooms);
   } catch (error) {
      console.error('Error fetching chatrooms:', error);
      res.status(500).json({ message: 'Error fetching chatrooms', error });
   }
});

// Create a new chatroom
router.post('/create', async (req, res) => {
   const { name, type, participants, password } = req.body;

   if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required.' });
   }

   try {
      const newChatroom = new Chatroom({ name, type });

      if (type === 'group') {
         newChatroom.participants = participants;
      } else if (type === 'private') {
         newChatroom.password = password;
      }

      await newChatroom.save();
      res.status(200).json(newChatroom);
   } catch (error) {
      console.error('Error creating chatroom:', error);
      res.status(500).json({ message: 'Error creating chatroom', error });
   }
});
// verify password
router.post('/verify-password', async (req, res) => {
   const { chatroomId, password } = req.body;

   try {
      const chatroom = await Chatroom.findById(chatroomId);

      if (chatroom.password === password) {
         res.json({ success: true });
      } else {
         res.json({ success: false });
      }
   } catch (error) {
      console.error('Error verifying password:', error);
      res.status(500).json({ message: 'Error verifying password', error });
   }
});   

module.exports = router;
