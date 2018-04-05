let moment = require('moment');
let date = new moment();


/*function formatHours (hrs ) {
    if (hrs <= 10) {
        return '0' + hrs;
    } else {
        return hrs;
    }
}

function formatMinutes (mins) {
    if (mins <= 10) {
        return '0' + mins;
    } else {
        return mins;
    }
}*/

let generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: date.valueOf()
    }
};

let generateLocationMessage = (from, latitude, longitude) => {
    return {
        from,
        url: `http://www.google.com/maps?q=${latitude}, ${longitude}`,
        createdAt: date.valueOf()
    }
};

module.exports = {
    generateMessage,
    generateLocationMessage
};