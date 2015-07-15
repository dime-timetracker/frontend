'use strict';

var expect = require('expect.js');

var duration = require('./duration');

describe('duration', function () {

  it('should convert duration number (3600) into formated string 01:00:00', function () {
    var result = duration(3600);
    expect(result).to.be('01:00:00');
  });

  it('should convert duration number (43200) into formated string 12:00:00', function () {
    var result = duration(43200);
    expect(result).to.be('12:00:00');
  });

});
