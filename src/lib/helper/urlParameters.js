'use strict';

var forOwn = require('lodash/forOwn');
var isUndefined = require('lodash/isUndefined');
var isPlainObject = require('lodash/isPlainObject');

/**
 * Concatenates and encode parameter object, divided by ampersand.
 *
 * Example:
 * urlParameters({key1: 'value1', key2: 'value2'}) => 'key1=value1&key2=value2'
 *
 * @param {Object} parameters
 * @returns {String}
 */
var urlParameters = function (parameters) {
  var result = [];
  if (isPlainObject(parameters)) {
    forOwn(parameters, function pushToResult(value, key)  {
      if (!isUndefined(value)) {
        result.push(key + '=' + encodeURI(value));
      }
    });
  }
  return result.join('&');
};

module.exports = urlParameters;
