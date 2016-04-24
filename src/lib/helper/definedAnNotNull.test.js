'use strict';

var expect = require('expect.js');

var definedAndNotNull = require('./definedAndNotNull');

describe('definedAndNotNull', function() {
  var obj = {
    first: undefined,
    second: null,
    third: true,
    fourth: 'test'
  };

  it('should be false if object property is not defined', function () {
    expect(definedAndNotNull(obj.first)).to.be(false);
  });

  it('should be false if object property is null', function () {
    expect(definedAndNotNull(obj.first)).to.be(false);
  });

  it('should be true if object property is defined', function () {
    expect(definedAndNotNull(obj.third)).to.be(true);
  });

  it('should be true if object property is defined and a string', function () {
    expect(definedAndNotNull(obj.fourth)).to.be(true);
  });

});
