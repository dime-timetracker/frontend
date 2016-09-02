'use strict';

var m = require('src/lib/mithril');
var isFunction = require('lodash/isFunction');

var text = function (value, options) {
  var attr = {
    contenteditable: true
  };

  if (isFunction(options.update)) {
    attr.oninput = function(e) {
      options.update(e.target.textContent, e);
    };
  }
  return m('span.form-control-static', attr, value);
};

module.exports = text;
