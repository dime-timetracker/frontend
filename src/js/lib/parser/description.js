'use strict';

module.exports = function (obj) {
  obj.description = obj._text.trim().replace(/ +/g, ' ');
  delete obj._text;
  return obj;
};
