'use strict';

module.exports = function (obj) {
  return require('./alias')(obj, 'service', ':');
};
