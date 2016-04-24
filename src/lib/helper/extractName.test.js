'use strict';

var expect = require('expect.js');

var extractName = require('./extractName');

describe('extractName', function () {

  it('should extract name out of a namespaced string', function () {
    var name = extractName('this.is.a.long.namespace');
    expect(name).to.be('namespace');
  });

  it('should extract empty name when delimiter is the last in string', function () {
    var name = extractName('this.is.a.long.namespace.');
    expect(name).to.be('');
  });

});