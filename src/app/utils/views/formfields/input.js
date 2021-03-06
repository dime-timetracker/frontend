'use strict'

const m = require('src/lib/mithril')
const isFunction = require('lodash/isFunction')

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
    type: options.type || 'text',
    value: value
  }
  if (options.id) {
    attributes.id = options.id
  }
  if (options.name) {
    attributes.name = options.name
  }
  if (options.placeholder) {
    attributes.placeholder = options.placeholder
  }
  if (isFunction(options.change)) {
    attributes.onchange = (e) => { options.change(e.target.value, e) }
  }

  return m('input.form-control' + ((options.inline) ? '.form-control-inline' : ''), attributes)
}
