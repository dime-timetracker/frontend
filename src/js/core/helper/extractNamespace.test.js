'use strict';

var expect = require('expect.js');

var extractNamespace = require('./extractNamespace');

describe('extractNamespace', function () {

  it('should remove the last in namespace including the delimiter', function () {
    var name = extractNamespace('this.is.a.long.namespace');
    expect(name).to.be('this.is.a.long');
  });

  it('should extract all when delimiter is the last in string', function () {
    var name = extractNamespace('this.is.a.long.namespace.');
    expect(name).to.be('this.is.a.long.namespace');
  });

});