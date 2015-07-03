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

var form = function (configItem) {
  if (_.isFunction(configItem.onRender) && false === configItem.onRender()) {
    return null;
  }
  var type = configItem.type ? configItem.type : 'text';
  var update = function (value) {
    if (_.isFunction(configItem.onWrite)) {
      value = configItem.onWrite(value);
    }
    configuration.set(configItem.name, value);
  };
  var value = configuration.get(configItem.name, configItem.defaultValue);
  if (_.isFunction(configItem.onRead)) {
    value = configItem.onRead(value);
  }
  var input;
  if (inputs[type]) {
    input = inputs[type](value, update, type);
  } else {
    input = inputs.input(value, update, type);
  }

  var formItem = [input];
  if (!_.isUndefined(configItem.description)) {
    formItem.push(m('span.form-help', t(configItem.description)));
  }

  return m('p.row.form-group#setting-' + configItem.name, [
    m('.col-md-3', t(configItem.title)),
    m('.col-md-9', formItem)
  ]);
};

module.exports = form;