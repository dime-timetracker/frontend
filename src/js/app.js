'use strict';

var m = require('mithril');
var parameters = require('./parameters');

var routes = {
  '/': require('./components/activity'),
  '/login': require('./components/login'),
  '/settings': require('./components/setting'),
  '/:name': require('./components/crud/crud')
 };

m.route.mode = 'hash';
m.route(document.getElementById("app"), '/', routes);
m.mount(document.getElementById("app-header"), require('./components/header'));
m.mount(document.getElementById("app-menu"), require('./components/menu'));
