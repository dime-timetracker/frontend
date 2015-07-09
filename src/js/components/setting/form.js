'use strict';

var m = require('mithril');
var _ = require('lodash');
var t = require('../../translation');
var configuration = require('../../core/configuration');
var inputs = {
  input: require('../../core/views/form/input'),
  text: require('../../core/views/form/text'),
  select: require('../../core/views/form/select'),
  boolean: require('../../core/views/form/selectBoolean')
};

var component = {};

component.controller = function (scope) {
  scope.type = scope.configItem.type || 'text';

  scope.value = function () {
    var value = configuration.get(scope.path, scope.configItem.defaultValue);
    if (_.isFunction(scope.configItem.onRead)) {
      value = scope.configItem.onRead(value);
    }
    return value;
  };

  scope.update = function (value, e) {
    if (e) {
      e.preventDefault();
    }
    if (_.isFunction(scope.configItem.onWrite)) {
      value = scope.configItem.onWrite(value);
    }
    configuration.set(scope.path, value);
  };

  return scope;
};

component.view = function (scope) {
  var input = [];
  if (inputs[scope.type]) {
    input.push(inputs[scope.type](scope.value(), scope.update, scope.type));
  } else {
    input.push(inputs.input(scope.value(), scope.update, scope.type));
  }

  var description = t('config.' + scope.path + '.description');
  if (0 !== description.indexOf('@@')) {
    input.push(m('span.form-help', description));
  }

  return m('p.row.form-group', [
    m('.col-md-3', t('config.' + scope.path + '.title')),
    m('.col-md-9', input)
  ]);
};

module.exports = component;
