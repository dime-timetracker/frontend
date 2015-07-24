'use strict';

var expect = require('expect.js');
var parseCustomer = require('./customer');

describe('customer alias parser', function() {

  it('should ignore text without prefix', function () {
    var input = 'foo ba-r baz';
    var result = parseCustomer({ _text: input });
    expect(result).not.to.have.property('customer');
    expect(result).to.have.property('_text');
    expect(result._text).to.eql(input);
  });

  it('should extract customer alias', function () {
    var input = 'foo @ba-r baz';
    var result = parseCustomer({ _text: input });
    expect(result).to.have.property('customer');
    expect(result.customer).to.eql({alias: 'ba-r'});
    expect(result).to.have.property('_text');
    expect(result._text).to.eql('foo  baz');
  });

});
