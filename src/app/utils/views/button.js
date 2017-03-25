'use strict'

const m = require('src/lib/mithril')

/**
 * Button is mithril virtual element that will generate a float button
 * with a text, an optional action and a optional onclick.
 */
module.exports = (options) => {
  const button = options.buttonOptions || {}
  if (!button.config) {
    button.config = m.route
  }
  if (options.title) {
    button.title = options.title
  }
  if (options.onclick) {
    button.onclick = options.onclick
  }
  if (options.href) {
    button.href = options.href
  }
  button.class = (button.class || '') + ' ' + (options.color || 'fbtn-red')

  const icon = options.iconOptions || {}
  icon.class = (icon.class || '') + ' ' + (options.icon || 'icon-add')

  return m('.fbtn-container', m('.fbtn-inner',
    m('a[href=""].fbtn', button, [
      m('span.fbtn-text', options.title || ''),
      m('span.icon', icon)
    ])
  ))
}
