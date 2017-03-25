'use strict'

const m = require('src/lib/mithril')

/**
 * Button is mithril virtual element that will generate a float button
 * with a text, an optional action and a optional onclick.
 */
module.exports = (options) => {
  const button = options.buttonOptions || {}
  let buttonTagName = button.tagName || 'span'
  if (options.title) {
    button.title = options.title
  }
  if (options.onclick) {
    button.onclick = options.onclick
  }
  if (options.href) {
    button.href = options.href
    buttonTagName = 'a'
    if (!button.config) {
      button.config = m.route
    }
  }
  button.class = (button.class || '') + ' ' + (options.color || 'fbtn-red')

  const icon = options.iconOptions || {}
  icon.class = (icon.class || '') + ' ' + (options.icon || 'icon-add')

  const inner = [m(buttonTagName + '.fbtn', button, [
    m('span.fbtn-text', options.title || ''),
    m('span.icon', icon)
  ])]

  if (options.before) {
    inner.unshift(options.before)
  }

  if (options.after) {
    inner.push(options.after)
  }

  return m('.fbtn-container', m('.fbtn-inner', inner))
}
