'use strict';

var merge = require('lodash/object/merge');
var settings = require('./collection/settings');
var extractNamespace = require('./helper/extractNamespace');
var extractName = require('./helper/extractName');
var defaultDelimiter = '/';


var configuration = {
  sections: {
    general: {},
    activity: {},
    prompt: {}
  }
};

/**
 * Retrieve configuration value.
 *
 * @param {string} name
 * @param {type} defaultValue
 * @returns {mixed}
 */
configuration.get = function (name, defaultValue) {
  var namespace = extractNamespace(name, defaultDelimiter);
  name = extractName(name, defaultDelimiter);

  var value = defaultValue;
  var filter = {
    name: name
  };

  if (namespace && namespace !== name) {
    filter.namespace = namespace;
  }

  if (settings) {
    var setting = settings.find(filter);
    if (setting && setting.value) {
      value = setting.value;
    }
  }

  return value;
};

/**
 * Set a configuration value and save it to api.
 *
 * @param {String} name
 * @param {String} value
 * @returns {Configuration}
 */
configuration.set = function (name, value) {
  var namespace = extractNamespace(name, defaultDelimiter);
  name = extractName(name, defaultDelimiter);

  var filter = {
    name: name
  };

  if (namespace && namespace !== name) {
    filter.namespace = namespace;
  }

  if (settings) {
    var setting = settings.find(filter);
    if (setting) {
      setting.value = value;
    } else {
      setting = settings.modelize({
        name: name,
        value: name
      });

      if (namespace && namespace !== name) {
        setting.namespace = namespace;
      }
    }

    settings.persist(setting);
  }

  return this;
};

configuration.addSection = function (section) {
  this.sections = merge(this.sections, section);
};

module.exports = configuration;
