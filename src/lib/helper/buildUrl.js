'use strict';

var isArray = require('lodash/isArray');
var isPlainObject = require('lodash/isPlainObject');
var baseUrl = require('./baseUrl');
var urlParameters = require('./urlParameters');

/**
 * Concatinate url path with parameters
 *
 * Example:
 *
 * buildUrl(['api', 'activity'], {filer: '@customer'})
 * 	=> http://base/url/api/activity?filter=@customer
 *
 * @param {String|Array} path
 * @param {Object} parameters
 * @returns {String}
 */
var buildUrl = function (path, parameters) {
  var result = [];

  if (path) {
    if (!isArray(path)) {
      path = [path];
    }

    result.push(baseUrl.apply(this, path));
  }

  if (isPlainObject(parameters)) {
    result.push(urlParameters(parameters));
  }

  return result.join('?');
};

module.exports = buildUrl;
