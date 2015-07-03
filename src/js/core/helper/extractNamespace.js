'use strict';

var extractNamespace = function (name, delimiter) {
  delimiter = delimiter || '.';
  var idx = name.lastIndexOf(delimiter);
  var result = name;

  if (idx > -1) {
    result = name.slice(0, idx);
  }

  return result;
};

module.exports = extractNamespace;