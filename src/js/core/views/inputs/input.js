'use strict';

var m = require('mithril');

module.exports = function (value, update, type) {
  var attr = {
    type: 'text'
  };
  if (!_.isUndefined(value)) {
    attr.value = value;
  }

  if (_.isFunction(update)) {
    attr.oninput = function(e) {
      update(e.target.value);
    };
  }

  if (!_.isUndefined(type)) {
    attr.type = type;
  }

  return m('input.form-control', attr);
};