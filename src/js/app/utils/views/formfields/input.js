'use strict';

var m = require('mithril');
var isUndefined = require('lodash/lang/isUndefined');
var isFunction = require('lodash/lang/isFunction');

/**
 * Input field
 *
 * options = {
 *   type: String,
 *   update: func,
 *   inline: Boolean
 * }
 *
 * @param  {String} value
 * @param  {Object} options
 * @return {VirtualElement} input field
 */
var input = function (value, options) {
  options = options || {};

  var attr = {
    type: 'text'
  };
  if (!isUndefined(value)) {
    attr.value = value;
  }

  if (isFunction(options.update)) {
    attr.oninput = function (e) {
      options.update(e.target.value, e);
    };
  }

  if (!isUndefined(options.type)) {
    attr.type = options.type;
  }

  return m('input.form-control' + ((options.inline) ? '.form-control-inline' : ''), attr);
};

module.exports = input;
