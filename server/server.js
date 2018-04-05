const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const app = express();
const port = process.env.PORT || 5000;
const publicPath = path.join(__dirname, '../public');

let date = new Date;
let server = http.createServer(app);
let io = socketIO(server);

io.on('connection', (socket) => {
    console.log(`New User connected!`);
    // console.log(`New User connected at ${date.toLocaleTimeString()}`);

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user has joined the chat'));

    // listen for when a message is created
    socket.on('createMessage', (message, callback) => {
        // console.log(`createMessage: ${JSON.stringify(message, undefined, 3)}`);

        // emit the createMessage event to the client
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected from server!`);
        // console.error(`Disconnected from server! at ${date.toLocaleTimeString()}`);
        socket.broadcast.emit('userOut', generateMessage('Admin', 'User has left the chat'));
    });
});

app.use(express.static(publicPath)); // configure express to use the public folder

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    // console.log(`Server running on port ${port} at ${date.toLocaleTimeString()}`);
});
