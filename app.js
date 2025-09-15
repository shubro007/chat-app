import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";
import path from 'path';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
const __dirname = path.resolve();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Main connection logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // 1. Listen for the new 'nick name' event
  socket.on('nick name', (nickname) => {
    // Store the nickname on the socket object for this user
    socket.nickname = nickname;
    console.log(`${nickname} has joined the chat.`);
    
    // Broadcast to everyone (except the sender) that a new user joined
    socket.broadcast.emit('chat message', `${nickname} has joined the chat.`);
  });

  // 2. Listen for the 'chat message' event
  socket.on('chat message', (msg) => {
    // Prepend the user's stored nickname to the message
    // Then broadcast it to EVERYONE (including the sender)
    io.emit('chat message', `${socket.nickname}: ${msg}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (socket.nickname) {
      // Announce that the user left
      io.emit('chat message', `${socket.nickname} has left the chat.`);
    }
  });
});

httpServer.listen(3000, () => {
  console.log('Server is running on port 3000');
});