const express = require('express');
const router = express.Router();
const Users = require('../models/User');

// Get list of users
router.get('/list', async (req, res) => {
   try {
      const userList = await Users.find().sort({ userName: 1 }); // Sort by userName instead of timestamp
      res.json(userList);
   } catch (error) {
      console.error('Error fetching user list:', error);
      res.status(500).json({ error: 'Error fetching user list' });
   }
});

module.exports = router;
