'use strict';

var m = require('mithril');
var _ = require('lodash');
var t = require('../../../translation');
var select = require('./select');

var selectBoolean = function (value, update) {
  var values = [
    { 1: t('yes') },
    { 0: t('no') }
  ];

  return select(values, update, (value === true) ? 1 : 0);
};

module.exports = selectBoolean;