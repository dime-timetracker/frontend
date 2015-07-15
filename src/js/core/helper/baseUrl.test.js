'use strict';

var expect = require('expect.js');

var baseUrl = require('./baseUrl');

describe('baseUrl', function () {

  it('should join given parameter strings into url path', function () {
    var result = baseUrl('api', 'activity');
    expect(result).to.be('api/activity');
  });

  it('should join given parameter strings into url path with baseUrl', function () {
    var env = require('../env');
    env.baseUrl = 'http://www/to/path';

    var result = baseUrl('api', 'activity');
    expect(result).to.be('http://www/to/path/api/activity');
  });

});
