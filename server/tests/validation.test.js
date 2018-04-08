const expect = require('expect');
const { isRealString } = require('./../utils/validation');

describe('isRealString', () => {
    it('should reject not-string values', () => {
        let result = isRealString(9)
        expect(result).toBe(false);
    });

    it('should reject string with only spaces', () => {
        let result = isRealString('  ');
        expect(result).toBe(false);
    });

    it('should allow string with non-space characters', () => {
        let result = isRealString(' Alaba ');
        expect(result).toBe(true);
    });
});