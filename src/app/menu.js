'use strict'

var m = require('src/lib/mithril')
var t = require('../lib/translation')
var authorize = require('../lib/authorize')

var state = 'close'
var items = [
  {
    id: 'home',
    route: '/',
    name: 'menu.activities',
    icon: 'icon-access-time'
  },
  {
    id: 'customers',
    route: '/customer',
    name: 'menu.customers',
    icon: 'icon-people',
    weight: 0
  },
  {
    id: 'projects',
    route: '/project',
    name: 'menu.projects',
    icon: 'icon-poll',
    weight: 0
  },
  {
    id: 'services',
    route: '/service',
    name: 'menu.services',
    icon: 'icon-work',
    weight: 0
  },
  {
    id: 'tags',
    route: '/tag',
    name: 'menu.tags',
    icon: 'icon-label',
    weight: 0
  },
  {
    id: 'reports',
    route: '/report/today',
    name: 'menu.reports',
    icon: 'icon-toc',
    weight: 0
  },
  {
    id: 'setting',
    route: '/settings',
    name: 'menu.settings',
    icon: 'icon-settings',
    weight: 0
  },
  {
    id: 'logout',
    name: 'menu.logout',
    icon: 'icon-exit-to-app',
    weight: 2000,
    onclick: function (e) {
      authorize.signout()
    }
  }
]

function itemView (item) {
  var menuItem = []
  var text = []
  var active = (m.route() === item.route) ? '.active' : ''

  if (item.icon) {
    text.push(m('span.icon.' + item.icon))
  }
  if (item.name) {
    text.push(t(item.name))
  }
  if (item.route) {
    menuItem.push(m('a[href="' + item.route + '"]', {
      onclick: function (e) {
        component.toggle()
      },
      config: m.route
    }, text))
  } else if (typeof (item.onclick) === 'function') {
    menuItem.push(m('a[href=""]', {
      config: m.route,
      onclick: function (e) {
        component.toggle()
        return item.onclick(e)
      }
    }, text))
  }

  return m('li' + active, menuItem)
}

var component = {}

component.view = function (scope) {
  return m('nav.menu.' + state, {
    onclick: scope.toggle
  }, m('.menu-scroll', m('.menu-wrap', m('.menu-content', m('ul.nav', items.map(itemView))))))
}

component.toggle = function (e) {
  state = (state === 'open') ? 'close' : 'open'
  return false
}

module.exports = component
