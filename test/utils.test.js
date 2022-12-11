const should = require('chai').should();
const { generateNewId, getUserByEmail, getUrlsByUserId } = require('../utils');

const db = {
  urls: {
    abc123: {
      id: 'abc123',
      longURL: 'https://www.lighthouselabs.ca',
      userId: 'zxc135',
    },
    def456: {
      id: 'def456',
      longURL: 'https://www.google.com',
      userId: 'cvb246',
    },
  },
  users: {
    zxc135: {
      id: 'zxc135',
      email: 'user1@test.com',
      password: '123',
    },
    cvb246: {
      id: 'cvb246',
      email: 'user2@test.com',
      password: '123',
    },
  },
};

describe('utils', () => {
  describe('#generateNewId()', () => {
    it('should return a random string of 6 characters length when an argument is not present', () => {
      const newId = generateNewId();
      newId.should.be.a('string');
      newId.should.have.lengthOf(6);
    });
    it('should return a random string of X characters length when an argument is present', () => {
      const newId3chars = generateNewId(3);
      newId3chars.should.be.a('string');
      newId3chars.should.have.lengthOf(3);

      const newId10chars = generateNewId(10);
      newId10chars.should.be.a('string');
      newId10chars.should.have.lengthOf(10);
    });
  });

  describe('#getUserByEmail()', () => {
    it('should return an object with properties id, email and password', () => {
      const user = getUserByEmail('user1@test.com', db['users']);

      user.should.be.an('object');
      user.should.have.property('id');
      user.should.have.property('email');
      user.should.have.property('password');

      user.id.should.be.a('string');
      user.email.should.be.a('string');
      user.password.should.be.a('string');
    });
    it('should return undefined when user is not found', () => {
      const user = getUserByEmail('bad-email@test.com', db['users']);
      should.not.exist(user);
    });
  });

  describe('#getUrlsByUserId()', () => {
    it('should return an object on objects with properties id, longURL and userId', () => {
      const urls = getUrlsByUserId('cvb246', db['urls']);
      urls.should.be.an('object');

      for (const id in urls) {
        const url = urls[id];
        url.should.have.property('id');
        url.should.have.property('longURL');
        url.should.have.property('userId');

        url.id.should.be.a('string');
        url.longURL.should.be.a('string');
        url.userId.should.be.a('string');
      }
    });
    it('should return empty object when userId is not found', () => {
      const urls = getUrlsByUserId('bad-id', db['urls']);
      urls.should.be.an('object');

      for (const id in urls) {
        const url = urls[id];
        should.not.exist(url);
      }
    });
  });
});
