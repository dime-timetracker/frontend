'use strict'

const m = require('src/lib/mithril')
const isFunction = require('lodash/isFunction')

/**
 * Textarea field
 *
 * options = {
 *   type: String,
 *   update: func,
 *   inline: Boolean
 * }
 *
 * @param  {Object} options
 * @param  {String} value
 * @return {VirtualElement} textarea field
 */
module.exports = function (options, value) {
  options = options || {}

  if (value === null || value === undefined) {
    value = options.value
  }
  const attributes = {
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

  return m('textarea.form-control' + ((options.inline) ? '.form-control-inline' : ''), attributes)
}
