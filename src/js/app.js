'use strict';

var m = require('mithril');
var routes = {
  '/': require('./modules/activity'),
  '/login': require('./modules/login'),
  '/settings': require('./modules/setting')
 };

m.route.mode = 'hash';
m.route(document.getElementById("app"), '/', routes);
m.mount(document.getElementById("app-header"), require('./modules/header'));
m.mount(document.getElementById("app-menu"), require('./modules/menu'));
