'use strict'

const m = require('src/lib/mithril')
const menu = require('./menu')

const settings = require('../api/setting')

function logoView (scope) {
  return m('a[href="#/"].header-logo', [
    m('span.icon.' + scope.icon), ' ', scope.name]
  )
}

function controller () {
  const scope = {
    icon: settings.find('global.header.icon'),
    name: settings.find('global.header.name'),
    color: settings.find('global.header.color')
  }
  return scope
}

function view (scope) {
  var content = [
    m('ul.nav.nav-list.pull-left',
      m('li', m('a[href=#]', {
        onclick: menu.toggle
      }, [
        m('span.access-hide', 'Menu'),
        m('span.icon.icon-menu.icon-lg')
      ]))
    ),
    logoView(scope)
  ]

  return m('header.header.fixed.' + scope.color, content)
}

module.exports = {
  controller: controller,
  view: view
}
