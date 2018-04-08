let socket = io();
let messageTextBox = $('[name=message]');

function scrollToBottom () {
    // selectors
    let messages = $('#messages');
    let newMessage = messages.children('li:last-child');

    // heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('clientHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    console.log('Connected to server!');
    let params = $.deparam(window.location.search.toLowerCase());

    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } /*else {
            console.log('No Error');
        }*/
    });
});

socket.on('disconnect', function () {
    console.warn('User disconnected from server!');
});

socket.on('updateUserList', function (users) {
    let ol = $('<ol></ol>');

    users.forEach(function (user) {
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol);
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

    if (messageTextBox.val().trim() === '') {
        return false;
    } else {
        socket.emit('createMessage', {
            text: messageTextBox .val()
        }, function () {
            messageTextBox.val('')
        });
    }
});

/*// emit typing event when user is typing
messageTextBox.on('keypress', function () {
    socket.emit('typing');
});

// listen for typing event
socket.on('typing', function (message) {
    let formattedTime = moment(message.createdAt).format('HH:mm');
    let template = $('#message-template').html();
    let html = Mustache.render(template, {
        text: 'Anonymous is typing...',
        from: message.from,
        createdAt: formattedTime
    });

    $('#messages').append(html);
});*/

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
        // console.log(position);
    }, function () {
        locationButton.removeAttr('disabled').text('Share Location');
        alert('Unable to fetch location!');
    });
});