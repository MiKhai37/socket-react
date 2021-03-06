const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const port = process.env.PORT || 5000;
const index = require('./routes/index');

const app = express();
app.use(index);

app.use(cors({
  origin: 'http://localhost:3000'
}));

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
});

let interval

io.on('connection', (socket) => {
  console.log('New client connected');
  if (interval) {
    clearInterval(interval);
  };
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});


const getApiAndEmit = (socket => {
  const response = new Date();
  socket.emit('FromAPI', response);
})

server.listen(port, () => console.log(`Listening on port ${port}`));



