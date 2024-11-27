const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static('public'));

// Store connected users and document content
let connectedUsers = new Set();
let documentContent = '';

io.on('connection', (socket) => {
    console.log('User connected');
    
    // Add user to connected users
    socket.on('new-user', (username) => {
        socket.username = username;
        connectedUsers.add(username);
        io.emit('user-list', Array.from(connectedUsers));
        // Send current document content to new user
        socket.emit('init-document', documentContent);
    });

    // Handle text changes
    socket.on('text-change', (data) => {
        documentContent = data.content;
        socket.broadcast.emit('text-update', {
            content: data.content,
            user: socket.username
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        if (socket.username) {
            connectedUsers.delete(socket.username);
            io.emit('user-list', Array.from(connectedUsers));
        }
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
