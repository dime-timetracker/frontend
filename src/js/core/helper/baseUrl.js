'use strict';

var isString = require('lodash/lang/isString');
var env = require('../env');

/**
 * concatenates arguments to base url, divided by slash
 *
 * Example:
 *
 * baseUrl('api', 'customer') => /base/url/api/customer
 *
 * @param args...
 * @returns {String}
 */
var baseUrl = function () {
  var uri = [];
  var contain = false;

  for (var i = 0; i < arguments.length; i++) {
    if (env.baseUrl
            && isString(arguments[i])
            && arguments[i].indexOf(env.baseUrl) !== -1) {
      contain = true;
    }
    uri.push(arguments[i]);
  }

  if (!contain && env.baseUrl) {
    uri.unshift(env.baseUrl);
  }

  return uri.join('/');
};

module.exports = baseUrl;
