'use strict';

var m = require('mithril');
var _ = require('lodash');
var t = require('../../translation');
var helper = require('../../core/helper');
var models = {
  customer: require('../../core/model/Customer'),
  project: require('../../core/model/Project'),
  service: require('../../core/model/Service')
};
var collections = {
  customer: require('../../core/collection/customers'),
  project: require('../../core/collection/projects'),
  service: require('../../core/collection/services')
};
var views = {
  button: require('../../core/views/button'),
  item: require('./views/item')
};

var component = {};

component.allowed = ['customer', 'project', 'service'];

// FIXME
_.forOwn(collections, function (value, key) {
  value.fetch();
});

component.controller = function () {
  var scope = {};

  var type = m.route.param('name');
  if (-1 === component.allowed.indexOf(type)) {
    m.route('/');
  }

  scope.type = type;
  scope.properties = models[type].properties;
  scope.collection = collections[type];
  //scope.collection.fetch();
  scope.add = function (e) {
    scope.collection.add({});
    return false;
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
    return views.item(scope, item);
  }));

  var list = [
    m('h2', t(scope.type + 's')),
    m('table.table.table-stripe.table-hover', [header, rows])
  ];

  return m('div.list-' + scope.type, [list, views.button('Add ' + scope.type, '/' + scope.type, scope.add)]);
};

module.exports = component;
