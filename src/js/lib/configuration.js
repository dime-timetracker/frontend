'use strict';

var extend = require('lodash/object/extend');
var create = require('lodash/object/create');
var get = require('lodash/object/get');
var set = require('lodash/object/set');

var settings = require('./collection/settings');
var extractNamespace = require('./helper/extractNamespace');
var extractName = require('./helper/extractName');
var defaultDelimiter = '/';

function findSetting(path) {
  var filter = {
    name: extractName(path, defaultDelimiter)
  };

  var namespace = extractNamespace(path, defaultDelimiter);
  if (namespace && namespace !== filter.name) {
    filter.namespace = namespace;
  }

  var setting = settings.find(filter);
  if (!setting) {
    setting = settings.add(filter);
  }

  return setting;
}

var Configuration = function (data) {
  if (!(this instanceof Configuration)) {
    return new Configuration(data);
  }
};

Configuration.prototype = create(Object.prototype, {
  constructor: Configuration
});

Configuration.prototype.addSection = function (section) {
  extend(this, section);
};

Configuration.prototype.get = function (name, defaultValue) {
  var path = name.replace(new RegExp(defaultDelimiter, 'g'), '.');
  var property = get(this, path);
  var value = defaultValue;
  if (property) {
    value = property.value || defaultValue;
  }

  var setting = findSetting(name);
  if (setting && setting.value) {
    value = setting.value;
  }

  return value;
};

Configuration.prototype.set = function (path, value) {
  set(this, path.replace(new RegExp(defaultDelimiter, 'g'), '.'), value);

  var setting = findSetting(path);
  if (setting) {
    setting.value = value;
  }
  settings.persist(setting);

  return this;
};

module.exports = new Configuration({
  general: {},
  activity: {},
  shell: {}
});
