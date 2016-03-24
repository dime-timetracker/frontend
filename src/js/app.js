'use strict'

const m = require('mithril')
require('./parameters')
global.window.dimeDebug = require('debug')
const settingsApi = require('./api/setting')
const settings = require('./app/setting')
const debug = require('debug')('index')

const routes = {
  '/': require('./app/activity'),
  '/customer': require('./app/customer'),
  '/login': require('./app/login'),
  '/settings': require('./app/setting'),
  '/report/:query': require('./app/report')
}

m.route.mode = 'hash'

// request settings and launch app afterwards
settingsApi.fetchAll().then((userSettings) => {
  settings.userSettings(userSettings)
  m.route(global.window.document.getElementById('app'), '/', routes)
  m.mount(global.window.document.getElementById('app-header'), require('./app/header'))
  m.mount(global.window.document.getElementById('app-menu'), require('./app/menu'))
}, (error) => {
  debug(error)
  if (error.error === 'Authentication error') {
    m.mount(global.window.document.getElementById('app'), routes['/login'], {
      onLogin: () => {
        require('./api/setting').init().then(() => {
          m.route(global.window.document.getElementById('app'), '/', routes)
        }, (error) => { debug(error) })
      }
    })
  } else {
    m.mount(global.window.document.getElementById('app'), {
      view: () => {
        return m('.card-wrap', m('.card.card-brand-accent', m('.card-main', [
          m('h1.card-heading', m('.card-inner', m('p', 'Something went terribly wrong. Please try reloading.'))),
          m('.card-inner', m('p', error.error))
        ])))
      }
    })
  }
  m.mount(global.window.document.getElementById('app-header'), require('./app/header'))
  m.mount(global.window.document.getElementById('app-menu'), require('./app/menu'))
})
