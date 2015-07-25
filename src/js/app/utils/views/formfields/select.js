'use strict';

var m = require('mithril');
var isArray = require('lodash/lang/isArray');
var isFunction = require('lodash/lang/isFunction');
var isPlainObject = require('lodash/lang/isPlainObject');

/**
 * select - generate a select VirtualElement.
 * @param   {array} values must be an array with values or a key-value-object {key: '', value: ''}
 * @param   {Object} options { onchange: func, selected: String }
 * @returns {VirtualElement} select element
 */
var select = function (values, options) {
  options = options || {};

  var attr = {};
  var optionList = [];
  if (isArray(values)) {
    optionList = values.map(function buildOptions(item) {
      var key = item;
      var value = item;
      if (isPlainObject(item)) {
        key = item.key;
        value = item.value;
      }
      return m('option', {
        'value': key,
        'selected': (options.selected === key)
      }, value);
    });
  }

  if (isFunction(options.onchange)) {
    attr.onchange = function (e) {
      var idx = e.target.selectedIndex;
      var value = e.target.options[idx].value;
      options.onchange(value, e);
    };
  }

  return m('select.form-control', attr, optionList);
};

module.exports = select;
