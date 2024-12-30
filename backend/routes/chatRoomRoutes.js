const express = require('express');
const Chatroom = require('../models/ChatRoom');
const router = express.Router();

// Get all chatrooms
router.get('/', async (req, res) => {
   try {
      const chatrooms = await Chatroom.find();
      res.json(chatrooms);
   } catch (error) {
      res.status(500).json({ message: 'Error fetching chatrooms', error });
   }
});

// Create a new chatroom
router.post('/create', async (req, res) => {
   const { name, type, participants } = req.body;

   if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required.' });
   }

   try {
      const newChatroom = new Chatroom({ name, type, participants });
      await newChatroom.save();
      res.status(201).json(newChatroom);
   } catch (error) {
      res.status(500).json({ message: 'Error creating chatroom', error });
   }
});

module.exports = router;
