'use strict';

var m = require('mithril');
var _ = require('lodash');
var t = require('../translation');
var helper = require('../core/helper');
var models = {
  customer: require('../core/model/Customer'),
  project: require('../core/model/Project'),
  service: require('../core/model/Service')
};
var collections = {
  customer: require('../core/collection/customers'),
  project: require('../core/collection/projects'),
  service: require('../core/collection/services')
};
var itemComponent = require('./crud/item');
var button = require('../core/views/button');

var component = {};

component.allowed = ['customer', 'project', 'service'];

// FIXME move to init process
_.forOwn(collections, function (value, key) {
  value.fetch();
});

component.controller = function () {
  var scope = {};

  var type = m.route.param('name');
  if (!models[type]) {
    m.route('/');
    return false;
  }

  scope.type = type;
  scope.properties = models[type].prototype.properties;
  scope.collection = collections[type];

  scope.add = function (e) {
    if (e) e.preventDefault();

    scope.collection.add({});
  };

  return scope;
};

component.view = function (scope) {
  var headers = scope.properties.map(function (property) {
    var options = property.options || {};
    return m('th', options, t(property.title));
  });
  headers.push(
    m('th.empty')
  );

  var header = m('thead', m('tr', headers));

  var rows = m('tbody', scope.collection.map(function (item) {
    return m.component(itemComponent, scope.collection, scope.properties, item);
  }));

  var list = [
    m('h2', t(scope.type + 's')),
    m('table.table.table-stripe.table-hover', [header, rows])
  ];

  return m('div.list-' + scope.type, [list, button('Add ' + scope.type, '/' + scope.type, scope.add)]);
};

module.exports = component;
