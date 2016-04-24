'use strict';

var expect = require('expect.js');
var parseCustomer = require('./description');

describe('description parser', function() {

  it('should turn all text into description', function () {
    var input = 'foo bar   baz';
    var result = parseCustomer({ _text: input });
    expect(result).to.have.property('description');
    expect(result.description).to.eql('foo bar baz');
    expect(result).not.to.have.property('_text');
  });

});
