const expect = require('expect');

const { Users } = require('./../utils/users');

describe('Users', () => {
    let users;
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '10',
            name: 'James',
            room: 'Party'
        }, {
            id: '11',
            name: 'Robben',
            room: 'Sports'
        }, {
            id: '17',
            name: 'Muller',
            room: 'Party'
        }]
    });

    it('should add new user', () => {
        let users = new Users();
        let user = {
            id: '123',
            name: 'Andrew',
            room: 'The Office Fans'
        };

        let resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        let userId = '17';
        let user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove user', () => {
        let userId = '999';
        let user = users.removeUser(userId);

        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('should find user', () => {
        let userId = '10';
        let user = users.getUser(userId);
        expect(user.id).toBe(userId);
        /*let user = users.getUser(users.users[0].id);
        expect(user).toEqual(users.users[0].name)*/
    });

    it('should not find user', () => {
        let userId = '999';
        let user = users.getUser(userId);
        expect(user).toNotExist()
        /*expect(user.id).toBe(userId);
        let user = users.getUser(6512);
        expect(user).toNotExist(undefined)*/
    });

    it('should return names for PARTY room', () => {
        let userList = users.getAllUsers('Party');
        expect(userList).toEqual(['James', 'Muller']);
    });

    it('should return names for SPORTS room', () => {
        let userList = users.getAllUsers('Sports');
        expect(userList).toEqual(['Robben']);
    });
});