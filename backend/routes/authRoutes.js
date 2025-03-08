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

      // Validate input
      if (!email || !password || !userName) {
         return res.status(400).json({ message: 'All fields are required!' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ message: 'User already exists!' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);

      // Create new user
      const newUser = new User({ email, password: hashedPassword, userName });
      await newUser.save();

      // Return success response
      res.status(200).json({ message: 'User created successfully!' });
   } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ message: 'Something went wrong!' });
   }
});

// Login API
router.post('/login', async (req, res) => {
   console.log('Login === ' + req.body);
   try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
         return res.status(400).json({ message: 'All fields are required!' });
      }

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

      // Return success response
      res.status(200).json({
         user: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
         },
         token, // Optional if using JWT
      });
   } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Something went wrong!' });
   }
});

module.exports = router;
