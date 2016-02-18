'use strict'

const m = require('mithril')
const isFunction = require('lodash/lang/isFunction')

/**
 * Input field
 *
 * options = {
 *   type: String,
 *   update: func,
 *   inline: Boolean
 * }
 *
 * @param  {Object} options
 * @param  {String} value
 * @return {VirtualElement} input field
 */
module.exports = function (options, value) {
  options = options || {}

  if (value === null || value === undefined) {
    value = options.value
  }

  const attributes = {
    name: options.name,
    checked: value,
    type: 'checkbox',
    value: 1
  }
  if (isFunction(options.update)) {
    attributes.oninput = (e) => { options.update(e.target.value, e) }
  }

  return m('input.form-control' + ((options.inline) ? '.form-control-inline' : ''), attributes)
}
