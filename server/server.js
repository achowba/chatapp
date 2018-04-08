const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const app = express();
const port = process.env.PORT || 5000;
const publicPath = path.join(__dirname, '../public');

let date = new Date;
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath)); // configure express to use the public folder
app.use((req, res, next) => {
    console.log(req);
    res.status(404);
    res.send(`${req.originalUrl} Not Found`);
});

io.on('connection', (socket) => {
    console.log(`New User connected!`);

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
           return callback('Name and room name are required');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getAllUsers(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the chat`));
        callback();
    });

    // listen for when a message is created
    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        // emit the createMessage event to the client
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);

        if (user) {
            // io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    /*socket.on('typing', () => {
        socket.broadcast.emit('typing', generateMessage('Admin', 'Anonymous is typing'));
    });*/

    socket.on('disconnect', () => {
        console.log(`Disconnected from server! at ${date.toLocaleTimeString()}`);
        // socket.broadcast.emit('userOut', generateMessage('Admin', 'User has left the chat'));

        let user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getAllUsers(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the chat.`));
        }
    });
});


server.listen(port, () => {
   console.log(`Server running on port ${port} at ${date.toLocaleTimeString()}`);
});
