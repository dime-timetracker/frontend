'use strict';

var m = require('mithril');
var routes = {
  '/': require('./modules/activity')
};

m.route.mode = 'hash';
m.route(document.body, '/', routes);
