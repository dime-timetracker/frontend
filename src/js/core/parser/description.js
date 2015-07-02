'use strict';

module.exports = function (obj) {
  obj.description = obj._text.trim().replace(/ +/, ' ');
  return obj;
};
