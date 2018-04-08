let moment = require('moment');
let date = new moment();

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