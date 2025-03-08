const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get list of users
router.get('/list', async (req, res) => {
   try {
      const userList = await User.find().sort({ userName: 1 }); // Sort by userName instead of timestamp
      res.json(userList);
   } catch (error) {
      console.error('Error fetching user list:', error);
      res.status(500).json({ error: 'Error fetching user list' });
   }
});

// Update profile picture
router.put('/update-profile-pic', async (req, res) => {
   const { userId, profilePic } = req.body;

   try {
      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      user.profilePic = profilePic;
      await user.save();

      res.status(200).json({ message: 'Profile picture updated successfully', profilePic: user.profilePic });
   } catch (error) {
      console.error('Error updating profile picture:', error);
      res.status(500).json({ message: 'Error updating profile picture' });
   }
});

module.exports = router;
