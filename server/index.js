const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io integration
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  // Clients will join a room named by their video taskId to get updates
  socket.on('join_task', (taskId) => {
    socket.join(taskId);
    console.log(`Socket ${socket.id} joined task room ${taskId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Pass io to request object so controllers can use it
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Worker initialization
const { initWorker } = require('./queue/videoQueue');
initWorker(io);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/video', require('./routes/video.routes'));
app.use('/api/developer', require('./routes/api.routes'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
