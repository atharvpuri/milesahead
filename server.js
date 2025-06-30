const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = 3000;

// Serve files from the public folder (like ui.html)
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/spaces.html'); // or 'ui.html' if that’s your main
});


io.on('connection', (socket) => {
  console.log('⚡ Someone connected');

  socket.on('join-space', (spaceId) => {
    socket.join(spaceId);
    console.log(`👤 Joined space: ${spaceId}`);
    io.to(spaceId).emit('system-message', 'A new user joined the space');
  });

  socket.on('chat-message', ({ spaceId, msg }) => {
    io.to(spaceId).emit('chat-message', msg);
  });

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms].slice(1); // ignore socket.id
    rooms.forEach(room => {
      io.to(room).emit('system-message', 'A user left the space');
    });
  });
});

http.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
