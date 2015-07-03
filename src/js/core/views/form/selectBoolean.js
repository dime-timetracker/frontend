'use strict';

var m = require('mithril');
var t = require('../../../translation');
var select = require('./select');

var selectBoolean = function (value, update) {
  var values = [
    { 'key': 1, 'value': t('yes') },
    { 'key': 0, 'value': t('no') }
  ];

  return select(values, update, (value === true) ? 1 : 0);
};

module.exports = selectBoolean;