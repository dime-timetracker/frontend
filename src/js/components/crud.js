'use strict';

var m = require('mithril');
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

component.controller = function() {
  // Change route if name is not listed
  var type = m.route.param('name');
  if (!models[type]) {
    m.route('/');
    return false;
  }

  var scope = {
    type: type,
    properties: models[type].prototype.properties,
    collection: collections[type]
  };

  scope.add = function(e) {
    if (e) {
      e.preventDefault();
    }
    scope.collection.add({});
  };

  return scope;
};

component.view = function(scope) {
  var list = [];

  list.push(m('h2', t(scope.type + 's')));
  
  list.push(m('h3.content-sub-heading', t('crud.enabled')));
  scope.collection.filter({ enabled: 1 }).forEach(function(model) {
    list.push(m.component(itemComponent, model, scope.collection));
  });

  list.push(m('h3.content-sub-heading', t('crud.disabled')));
  scope.collection.filter({ enabled: 0 }).forEach(function(model) {
    list.push(m.component(itemComponent, model, scope.collection));
  });

  list.push(button('Add ' + scope.type, '/' + scope.type, scope.add));

  return m('div.list-' + scope.type, list);
};

module.exports = component;
