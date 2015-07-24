'use strict';

var _ = require('lodash');

var objectKey = function (obj) {
  var result = undefined;
  if (!_.isUndefined(obj)) {
    result = obj.name || obj.alias || obj.id || obj;
  }
  return result;
};

module.exports = objectKey;