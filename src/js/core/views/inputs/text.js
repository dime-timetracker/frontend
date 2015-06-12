'use strict';

var m = require('mithril');

module.exports = function (value, update) {
  var attr = {
    contenteditable: true
  };

  if (_.isFunction(update)) {
    attr.onchange = function(e) {
      update(e.target.textContent);
    };
  }
  return m('span.form-control', attr, value);
};