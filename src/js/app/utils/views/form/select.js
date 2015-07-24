'use strict';

var m = require('mithril');
var isArray = require('lodash/lang/isArray');
var isFunction = require('lodash/lang/isFunction');
var isPlainObject = require('lodash/lang/isPlainObject');

/**
 * select - generate a select VirtualElement.
 * @param   {array} values must be an array with values or a key-value-object {key: '', value: ''}
 * @param   {function} onchange what should happen when option is changed
 * @param   {string} selected define the selected option
 * @returns {VirtualElement} select element
 */
var select = function (values, onchange, selected) {
  var options = [];
  var attr = {};

  if (isFunction(onchange)) {
    attr.onchange = function (e) {
      var idx = e.target.selectedIndex;
      var value = e.target.options[idx].value;
      onchange(value, e);
    };
  }

  if (isArray(values)) {
    options = values.map(function buildOptions(item) {
      var key = item;
      var value = item;
      if (isPlainObject(item)) {
        key = item.key;
        value = item.value;
      }
      return m('option', {
        'value': key,
        'selected': (selected === key)
      }, value);
    });
  }

  return m('select.form-control', attr, options);
};

module.exports = select;
