'use strict'

const m = require('mithril')
const isArray = require('lodash/lang/isArray')
const isFunction = require('lodash/lang/isFunction')

/**
 * select - generate a select VirtualElement.
 * @param   {Object} options { update: func, selected: String, options: Array of Objects containing value and label }
 * @param   {string} value of selected option
 * @returns {VirtualElement} select element
 */
module.exports = function (options, value) {
  options = options || {}

  var optionList = []
  if (isArray(options.options)) {
    options.options.map((option) => {
      optionList.push(m('option', {
        selected: option.value === value,
        value: option.htmlValue !== undefined ? option.htmlValue : option.value
      }, option.label))
    })
  }

  const attributes = {
    name: options.name
  }
  if (isFunction(options.change)) {
    attributes.onchange = (e) => {
      var idx = e.target.selectedIndex
      var value = e.target.options[idx].value
      options.change(value, e)
    }
  }

  return m('select.form-control', attributes, optionList)
}
