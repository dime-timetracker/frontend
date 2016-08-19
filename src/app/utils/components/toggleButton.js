'use strict'

const m = require('src/lib/mithril')

function controller (args) {
  const scope = {
    currentState: args.currentState,
    iconName: args.iconName,
    title: args.title,
    alternateTitle: args.alternateTitle,
    alternateIconName: args.alternateIconName || '.icon-close'
  }

  scope.onclick = function (e) {
    if (e) {
      e.preventDefault()
    }
    args.changeState(!args.currentState())
  }
  return scope
}

function view (scope) {
  let icon = scope.iconName
  const options = {
    onclick: scope.onclick,
    title: scope.title
  }
  if (scope.currentState()) {
    icon = scope.alternateIconName
    options.title = scope.alternateTitle || ''
  }
  return m('a.btn.btn-flat', options, m('span.icon.icon-lg' + icon))
}

module.exports = {
  controller: controller,
  view: view
}
