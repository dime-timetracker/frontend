'use strict';

var extractName = function (name, delimiter) {
  delimiter = delimiter || '.';
  var idx = name.lastIndexOf(delimiter);
  var result = name;

  if (idx > -1) {
    result = name.slice(idx + 1);
  }

  return result;
};

module.exports = extractName;