const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./../utils/message');

describe('generateMessage', () => {
    it('should generate the correct message object', function () {
        let from = 'Ribery';
        let text = 'I am an attacker';
        let message = generateMessage(from, text);

        expect(message).toInclude({
            from,
            text
        });
        expect(message.createdAt).toBeA('number');
    });
});

describe('generateLocationMessage', () => {
    it('should generate the correct location object', function () {
        let from = 'Ribery';
        let latitude = 9;
        let longitude = 9;
        let location = generateLocationMessage(from, latitude, longitude);
        let url = `http://www.google.com/maps?q=${latitude}, ${longitude}`;

        expect(location).toInclude({
            from,
            url
        });
        expect(location.createdAt).toBeA('number');
    });
});

