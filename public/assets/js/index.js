let socket = io();

function scrollToBottom () {

}

socket.on('connect', function () {
    console.log('Connected to server!');
});

socket.on('disconnect', function () {
    console.warn('User disconnected from server!');
});

socket.on('newMessage', function (message) {
    console.log('New Message!', message);

    let formattedTime = moment(message.createdAt).format('HH:mm');
    let template = $('#message-template').html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom()
});

socket.on('newLocationMessage', function (message) {
    /*let formattedTime = moment(message.createdAt).format('HH:mm');
    let li = $('<li></li>');
    let a = $('<a target="_blank">My Current Location</a>');

    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);
    $('#messages').append(li);*/

    let formattedTime = moment(message.createdAt).format('HH:mm');
    let template = $('#location-message-template').html();
    let html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    });
    $('#messages').append(html);
});

socket.on('userOut', function (message) {
    let formattedTime = moment(message.createdAt).format('HH:mm');
    let template = $('#message-template').html();
    let html = Mustache.render(template, {
        text: 'User has left the chat',
        from: message.from,
        createdAt: formattedTime
    });
    $('#messages').append(html);
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();

    let messageTextBox = $('[name=message]');

    if (messageTextBox.val().trim() === '') {
        return false;
    } else {
        socket.emit('createMessage', {
            from: 'User',
            text: messageTextBox .val()
        }, function () {
            messageTextBox.val('')
        });
    }
});

let locationButton = $('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser!');
    }

    locationButton.attr('disabled', 'disabled').text('Sharing Location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Share Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });
        console.log(position);
    }, function () {
        locationButton.removeAttr('disabled').text('Share Location');
        alert('Unable to fetch location!');
    });
});