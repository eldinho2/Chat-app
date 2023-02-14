const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(server);

const port = 3001;

app.use(cors());

io.on('connection', (socket) => {
  console.log(`User connected with id: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`User disconnected with id: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});