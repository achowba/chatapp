const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const port = process.env.PORT || 5000;
const publicPath = path.join(__dirname, '../public');

let date = new Date;
let server = http.createServer(app);
let io = socketIO(server);

io.on('connection', (socket) => {
    console.log(`New User connected at ${date.toLocaleTimeString()}`);

    // emit event from server to the client
    socket.emit('newEmail', {
        from: 'robben@gmail.com',
        text: 'Hey. what\'s up?',
        createdAt: 123
    });

    socket.on('createMessage', (message) => {
        console.log(`createMessage: ${JSON.stringify(message, undefined, 3)}`);

        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });

    socket.on('disconnect', () => {
        console.error(`Disconnected from server! at ${date.toLocaleTimeString()}`);
    });
});

app.use(express.static(publicPath)); // configure express to use the public folder

server.listen(port, () => {
    console.log(`Server running on port ${port} at ${date.toLocaleTimeString()}`);
});
