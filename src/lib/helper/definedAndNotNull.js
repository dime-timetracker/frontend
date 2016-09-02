'use strict';

var isUndefined = require('lodash/isUndefined');
var isNull = require('lodash/isNull');

var definedAndNotNull = function (arg) {
  return !isUndefined(arg) && !isNull(arg);
};

module.exports = definedAndNotNull;
