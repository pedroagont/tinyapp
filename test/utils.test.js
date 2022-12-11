const should = require('chai').should();
const { generateNewId } = require('../utils');

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
});
