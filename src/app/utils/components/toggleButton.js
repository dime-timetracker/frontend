'use strict'

const m = require('src/lib/mithril')

function controller (args) {
  const scope = {
    currentState: args.currentState,
    iconName: args.iconName,
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
  var icon = scope.iconName
  if (scope.currentState()) {
    icon = scope.alternateIconName
  }
  return m('a.btn.btn-flat', { onclick: scope.onclick }, m('span.icon.icon-lg' + icon))
}

module.exports = {
  controller: controller,
  view: view
}
