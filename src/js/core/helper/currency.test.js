'use strict';

var expect = require('expect.js');

var currency = require('./currency');

describe('currency', function () {

  it('should convert number (3.22) into formated string € 3,22', function () {
    var result = currency(3.22);
    expect(result).to.be('€ 3,22');
  });

  it('should convert number (3.22) into formated string $ 3,22', function () {
    var result = currency(3.22, '$ {number}');
    expect(result).to.be('$ 3,22');
  });

});
