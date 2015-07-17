'use strict';

var m = require('mithril');
var t = require('../translation');
var collections = {
  customer: require('../core/collection/customers'),
  project: require('../core/collection/projects'),
  service: require('../core/collection/services'),
  tag: require('../core/collection/tags')
};
var itemComponent = require('./crud/item');
var button = require('../core/views/button');

var component = {};

component.controller = function() {
  // Change route if name is not listed
  var type = m.route.param('name');
  if (!collections[type]) {
    m.route('/');
    return false;
  }

  var scope = {
    type: type,
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

  var collection = scope.collection.filter({ enabled: 1 });
  if (collection.length > 0) {
    collection.forEach(function(model) {
      list.push(m.component(itemComponent, model, scope.collection));
    });
  } else {
    list.push('p', t('crud.empty'));
  }

  list.push(m('h3.content-sub-heading', t('crud.disabled')));
  collection = scope.collection.filter({ enabled: 0 });
  if (collection.length > 0) {
    collection.forEach(function(model) {
      list.push(m.component(itemComponent, model, scope.collection));
    });
  } else {
    list.push(m('p', t('crud.empty')));
  }

  list.push(button('Add ' + scope.type, '/' + scope.type, scope.add));

  return m('div.list-' + scope.type, list);
};

module.exports = component;
