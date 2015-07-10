'use strict';

var m = require('mithril');

var component = {};

component.controller = function(model) {
  var scope = {};

  scope.name = function() {
    return model.alias;
  };
  scope.shortcut = function() {
    return (model.shortcut) ? model.shortcut : '';
  };

  return scope;
};

component.view = function(scope) {
  return m('span.btn.btn-flat.btn-sm.grey-text', [scope.shortcut(), scope.name()]);
};

module.exports = component;
