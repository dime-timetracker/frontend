'use strict';

var expect = require('expect.js');

var urlParameters = require('./urlParameters');

describe('urlParameters', function () {

  it('should merge object into parameter string', function () {
    var result = urlParameters({
      key1: 'value1',
      key2: 'value2',
      key3: 'value 3'
    });
    expect(result).to.be('key1=value1&key2=value2&key3=value%203');
  });

});
