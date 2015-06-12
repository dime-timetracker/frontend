'use strict';

var _ = require('lodash');

var local = {};

var Configuration = function(configuration) {
  if (!(this instanceof Configuration)) {
    return new Configuration(configuration);
  }

  _.extend(this, {}, configuration);
};
Configuration.prototype = new Object();
Configuration.prototype.constructor = Configuration;

Configuration.prototype.get = function (namespace, name, defaultValue) {
  if (_.isPlainObject(namespace)) {
    defaultValue = namespace.defaultValue;
    name = namespace.name;
    var namespace = namespace.namespace;
  }

  var filter = { namespace: namespace, name: name };
//  var setting = dime.resources.setting.find(filter) || filter ;
//  if (false === _.isUndefined(setting.value)) {
//    return setting.value;
//  }
//  return (_.isUndefined(defaultValue)) ? null : defaultValue;
};

Configuration.prototype.namespace = function (namespace) {
//  var filter = { namespace: namespace };
//  return dime.resources.setting.filter(filter);
};

Configuration.prototype.getLocal = function (name, defaultValue) {
  return local[name] || defaultValue;
};

Configuration.prototype.set = function (namespace, name, value) {
  if (_.isPlainObject(namespace)) {
    value = name;
    name = namespace.name;
    var namespace = namespace.namespace;
  }
  var filter = { namespace: namespace, name: name };
//  var setting = dime.resources.setting.find(filter) || filter;
//  setting.value = value;
//  dime.resources.setting.persist(setting);
};

Configuration.prototype.setLocal = function (name, value) {
  local[name] = value;
};

module.exports = new Configuration({
  general: {
    title: 'General',
    description: 'General Settings',
    children: {}
  }
});