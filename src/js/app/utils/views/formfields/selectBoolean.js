'use strict';

var t = require('../../../../lib/translation');
var select = require('./select');

var selectBoolean = function (value, options) {
  options = options || {};

  var values = [
    { 'key': 1, 'value': t('yes') },
    { 'key': 0, 'value': t('no') }
  ];

  return select(values, {
    update: options.update,
    selected: (value === true) ? 1 : 0
  });
};

module.exports = selectBoolean;
