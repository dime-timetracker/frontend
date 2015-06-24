'use strict';

var m = require('mithril');
var _ = require('lodash');
var t = require('../../../translation');

module.exports = function (value, update) {
  var options = [
    m('option', { selected: (value == true),  value: 1 }, t('yes')),
    m('option', { selected: (value == false),  value: 0 }, t('no'))
  ];

  var attr = {};
  if (_.isFunction(update)) {
    attr.onchange = function(e) {
      update(e.target.value);
    };
  }

  return m("select.form-control", attr, options);
};
