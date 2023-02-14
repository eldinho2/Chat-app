const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const port = 3001;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log(`User connected with id: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`User disconnected with id: ${socket.id}`);
  });
  socket.on('join_room', (roomName) => {
    console.log(`User: ${socket.id} joined room: ${roomName}`);
    socket.join(roomName);
  });
  socket.on('send_message', (data) => {
    console.log(`User: ${socket.id} sent message: ${data.message} to room: ${data.room}`);
    socket.to(data.room).emit('receive_message', data);
  })
  socket.on('receive_message', (data) => {
    console.log(`User: ${socket.id} sent message: ${data.message} to room: ${data.room}`);
    socket.to(data.room).emit('receive_message', data);
  });
});

server.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});