'use strict';

var m = require('mithril');
var isFunction = require('lodash/lang/isFunction');

var text = function (value, update) {
  var attr = {
    contenteditable: true
  };

  if (isFunction(update)) {
    attr.oninput = function(e) {
      update(e.target.textContent, e);
    };
  }
  return m('span.form-control', attr, value);
};

module.exports = text;
