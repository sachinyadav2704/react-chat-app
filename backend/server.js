const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const Message = require('./models/Message');

// Initialize dotenv
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const connectDB = async () => {
   try {
      await mongoose.connect(process.env.MONGO_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB!');
   } catch (error) {
      console.error('MongoDB connection failed:', error.message);
      process.exit(1);
   }
};

connectDB();

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = socketIo(server, {
   cors: {
      origin: '*', // Replace with your frontend domain for production
      methods: ['GET', 'POST'],
   },
});

io.on('connection', socket => {
   console.log('A user connected:', socket.id);

   // Handle incoming messages
   socket.on('message', async data => {
      console.log('Message received:', data);
      try {
         const message = await Message.create(data);
         io.to(data.chatroom).emit('message', message); // Broadcast to all users in the room
      } catch (error) {
         console.error('Error saving message:', error);
      }
   });

   // Join a specific chatroom
   socket.on('join-room', chatroomId => {
      console.log(`User ${socket.id} joined room: ${chatroomId}`);
      socket.join(chatroomId);
   });

   // Handle disconnect
   socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
   });
});

// Import routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/chatrooms', require('./routes/chatRoomRoutes'));

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
