'use strict';

var m = require('mithril');
var isUndefined = require('lodash/lang/isUndefined');
var isFunction = require('lodash/lang/isFunction');

var input = function (value, update, type) {
  var attr = {
    type: 'text'
  };
  if (!isUndefined(value)) {
    attr.value = value;
  }

  if (isFunction(update)) {
    attr.oninput = function (e) {
      update(e.target.value, e);
    };
  }

  if (!isUndefined(type)) {
    attr.type = type;
  }

  return m('input.form-control', attr);
};

module.exports = input;