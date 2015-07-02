'use strict';

var m = require('mithril');
var _ = require('lodash');

var input = function (value, update, type) {
  var attr = {
    type: 'text'
  };
  if (!_.isUndefined(value)) {
    attr.value = value;
  }

  if (_.isFunction(update)) {
    attr.oninput = update;
  }

  if (!_.isUndefined(type)) {
    attr.type = type;
  }

  return m('input.form-control', attr);
};

module.exports = input;