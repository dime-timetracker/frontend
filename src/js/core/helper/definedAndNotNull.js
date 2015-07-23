'use strict';

var isUndefined = require('lodash/lang/isUndefined');
var isNull = require('lodash/lang/isNull');

var definedAndNotNull = function (arg) {
  return !isUndefined(arg) && !isNull(arg);
};

module.exports = definedAndNotNull;
