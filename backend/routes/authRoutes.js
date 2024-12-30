const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model
const router = express.Router();

// Signup API
router.post('/signup', async (req, res) => {
   console.log('Signup === ' + req.body);
   try {
      const { email, password, userName } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ message: 'User already exists!' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({ email, password: hashedPassword, userName });
      await newUser.save();

      // Return success response
      res.status(200).json({ message: 'User created successfully!' });
   } catch (error) {
      res.status(500).json({ message: 'Something went wrong!' });
   }
});

// Login API
router.post('/login', async (req, res) => {
   console.log('Login === ' + req.body);
   try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(400).json({ message: 'User not found!' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(400).json({ message: 'Invalid credentials!' });
      }

      // Generate JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
         expiresIn: '1d',
      });

      //   res.status(200).json({ token, user: { id: user._id, email: user.email } });
      res.status(200).json({
         user: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
         },
         token, // Optional if using JWT
      });
   } catch (error) {
      res.status(500).json({ message: 'Something went wrong!' });
   }
});

module.exports = router;
