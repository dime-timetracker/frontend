'use strict';

var m = require('mithril');

var component = {};

component.controller = function(model, click) {
  var scope = {};

  scope.name = function() {
    return model.alias;
  };
  scope.shortcut = function() {
    return (model.shortcut) ? model.shortcut : '';
  };
  scope.click = click;

  return scope;
};

component.view = function(scope) {
  return m('span.btn.btn-flat.btn-sm.grey-text', { onclick: scope.click }, [scope.shortcut(), scope.name()]);
};

module.exports = component;
