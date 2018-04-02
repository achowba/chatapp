let socket = io();

socket.on('connect', function () {
    console.log('Connected to server!');
});

socket.on('disconnect', function () {
    console.warn('User disconnected from server!');
});

socket.on('newMessage', function (message) {
    console.log('New Message!', message);
});

