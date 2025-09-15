import express from 'express';

import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
//app.use(express.json());
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  io.emit('chat message',`${socket.id} connected to chat`);
  console.log('A user connected with ID:', socket.id);
  socket.on('disconnect', () => {
    console.log(socket.id, ' user disconnected');
    io.emit('chat message',`${socket.id} disconnected from chat`);
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

app.get('/', (req, res) => {
    res.sendFile('E:/coding challenges/sockets/index.html');
});

httpServer.listen(3000, (res,req) => {
    console.log("Server is Running");
});

// app.listen(3000, (res, req) => {
//     console.log("hi");
// })



