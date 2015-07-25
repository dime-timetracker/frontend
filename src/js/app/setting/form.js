'use strict';

var m = require('mithril');
var _ = require('lodash');
var t = require('../../lib/translation');
var configuration = require('../../lib/configuration');
var fields = {
  input: require('../utils/views/formfields/input'),
  text: require('../utils/views/formfields/text'),
  select: require('../utils/views/formfields/select'),
  boolean: require('../utils/views/formfields/selectBoolean')
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
  if (fields[scope.type]) {
    input.push(fields[scope.type](scope.value(), { update: scope.update() }));
  } else {
    input.push(fields.input(scope.value(), {
      update: scope.update,
      type: scope.type
    }));
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
