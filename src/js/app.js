'use strict';

var m = require('mithril');
require('./parameters');
global.window.dimeDebug = require('debug');

var routes = {
  '/': require('./app/activity'),
  '/login': require('./app/login'),
  '/settings': require('./app/setting'),
  '/:name': require('./app/crud')
 };

function prefetchData () {
  require('./lib/collection/activities').fetch();
  require('./lib/collection/customers').fetch();
  require('./lib/collection/projects').fetch();
  require('./lib/collection/services').fetch();
  require('./lib/collection/tags').fetch();
}
require('./lib/collection/settings').fetch().then(function () {
  prefetchData();

  m.route.mode = 'hash';
  m.route(global.window.document.getElementById('app'), '/', routes);
  m.mount(global.window.document.getElementById('app-header'), require('./app/header'));
  m.mount(global.window.document.getElementById('app-menu'), require('./app/menu'));
});
