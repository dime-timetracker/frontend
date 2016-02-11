'use strict'

var m = require('mithril')
require('./parameters')
global.window.dimeDebug = require('debug')

var routes = {
  '/': require('./app/activity'),
  '/login': require('./app/login'),
  '/settings': require('./app/setting'),
  '/report/:query': require('./app/report'),
  '/:name': require('./app/crud')
}

require('./api/setting').fetchAll().then(function () {
  m.route.mode = 'hash'
  m.route(global.window.document.getElementById('app'), '/', routes)
  m.mount(global.window.document.getElementById('app-header'), require('./app/header'))
  m.mount(global.window.document.getElementById('app-menu'), require('./app/menu'))
})
