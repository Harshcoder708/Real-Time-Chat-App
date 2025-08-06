const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    let currentRoom = '';

    socket.on('joinRoom', ({ username, room }) => {
        currentRoom = room;
        socket.join(room);
        socket.to(room).emit('message', {
            username: 'System',
            text: `${username} has joined the room!`
        });
    });

    socket.on('chatMessage', ({ username, room, text }) => {
        io.to(room).emit('message', {
            username,
            text
        });
    });

    socket.on('disconnect', () => {
        if (currentRoom) {
            socket.to(currentRoom).emit('message', {
                username: 'System',
                text: 'A user has left the room.'
            });
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
