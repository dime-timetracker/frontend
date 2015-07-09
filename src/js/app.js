'use strict';

var m = require('mithril');
var parameters = require('./parameters');
global.window.dimeDebug = require('debug');

var routes = {
  '/': require('./components/activity'),
  '/login': require('./components/login'),
  '/settings': require('./components/setting'),
  '/:name': require('./components/crud')
 };

function prefetchData () {
  require('./core/collection/activities').fetch();
  require('./core/collection/customers').fetch();
  require('./core/collection/projects').fetch();
  require('./core/collection/services').fetch();
  require('./core/collection/tags').fetch();
}
require('./core/collection/settings').fetch().then(function () {
  prefetchData();

  m.route.mode = 'hash';
  m.route(global.window.document.getElementById("app"), '/', routes);
  m.mount(global.window.document.getElementById("app-header"), require('./components/header'));
  m.mount(global.window.document.getElementById("app-menu"), require('./components/menu'));
});
