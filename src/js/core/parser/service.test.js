'use strict';

var expect = require('expect.js');
var parseService = require('./service');

describe('service alias parser', function() {

  it('should ignore text without prefix', function () {
    var input = 'foo ba-r baz';
    var result = parseService({ _text: input });
    expect(result).not.to.have.property('service');
    expect(result).to.have.property('_text');
    expect(result._text).to.eql(input);
  });

  it('should extract service alias', function () {
    var input = 'foo :ba-r baz';
    var result = parseService({ _text: input });
    expect(result).to.have.property('service');
    expect(result.service).to.eql({alias: 'ba-r'});
    expect(result).to.have.property('_text');
    expect(result._text).to.eql('foo  baz');
  });

});
