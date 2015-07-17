'use strict';

var m = require('mithril');
var forOwn = require('lodash/object/forOwn');
var t = require('../translation');
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

var buildHeader = function(properties) {
  var result = [];
  forOwn(properties, function(value, key) {
    result.push(m('th', value.options || {}, t(value.title || key)));
  });
  return result;
};

component.controller = function() {
  var scope = {};

  var type = m.route.param('name');
  if (!models[type]) {
    m.route('/');
    return false;
  }

  scope.type = type;
  scope.properties = models[type].prototype.properties;
  scope.collection = collections[type];

  scope.add = function(e) {
    if (e) {
      e.preventDefault();
    }

    scope.collection.add({});
  };

  return scope;
};

component.view = function(scope) {
  var headers = buildHeader(scope.properties);

  headers.push(
    m('th.empty')
  );

  var header = m('thead', m('tr', headers));

  var rows = m('tbody', scope.collection.map(function(item) {
    return m.component(itemComponent, item, scope.collection);
  }));

  var list = [
    m('h2', t(scope.type + 's')),
    m('table.table.table-stripe.table-hover', [header, rows])
  ];

  return m('div.list-' + scope.type, [list, button('Add ' + scope.type, '/' + scope.type, scope.add)]);
};

module.exports = component;
