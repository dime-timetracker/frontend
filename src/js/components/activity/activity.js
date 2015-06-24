'use strict';

var m = require('mithril');
var t = require('../../translation');
var activities = require('../../core/collection/activities');
var views = {
  button: require('../../core/views/button'),
  item: require('./views/item')
};

var component = {};

component.controller = function () {
  var scope = {};

  // FIXME Pager settings ...
  activities.fetch();
  scope.collection = activities;

  return scope;
};

component.view = function (scope) {
  var list = scope.collection.map(views.item, scope);
  
  return m(".tile-wrap", [ list, views.button(t('Add Activity'), '', scope.add) ]);
};

module.exports = component;
