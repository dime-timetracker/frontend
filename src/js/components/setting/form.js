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

component.controller = function (configItem) {
  var scope = {};

  scope.title = configItem.title;
  scope.help = configItem.description;
  scope.type = configItem.type ? configItem.type : 'text';

  scope.value = function () {
    var value = configuration.get(configItem.name, configItem.defaultValue);
    if (_.isFunction(configItem.onRead)) {
      value = configItem.onRead(value);
    }
    return value;
  };

  scope.update = function (value, e) {
    if (e) e.preventDefault();
    if (_.isFunction(configItem.onWrite)) {
      value = configItem.onWrite(value);
    }
    configuration.set(configItem.name, value);
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

  if (!_.isUndefined(scope.help)) {
    input.push(m('span.form-help', t(scope.help)));
  }

  return m('p.row.form-group', [
    m('.col-md-3', t(scope.title)),
    m('.col-md-9', input)
  ]);
};
//
//
//var form = function (configItem) {
//  if (_.isFunction(configItem.onRender) && false === configItem.onRender()) {
//    return null;
//  }
//  var type = configItem.type ? configItem.type : 'text';
//  var update = function (value) {
//    if (_.isFunction(configItem.onWrite)) {
//      value = configItem.onWrite(value);
//    }
//    configuration.set(configItem.name, value);
//  };
//  var value = configuration.get(configItem.name, configItem.defaultValue);
//  if (_.isFunction(configItem.onRead)) {
//    value = configItem.onRead(value);
//  }
//  var input;
//  if (inputs[type]) {
//    input = inputs[type](value, update, type);
//  } else {
//    input = inputs.input(value, update, type);
//  }
//
//  var formItem = [input];
//  if (!_.isUndefined(configItem.description)) {
//    formItem.push(m('span.form-help', t(configItem.description)));
//  }
//
//
//};

module.exports = component;