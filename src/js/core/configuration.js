'use strict';

var _ = require('lodash');
var settings = require('./collection/settings');
var extractNamespace = require('./helper/extractNamespace');
var extractName = require('./helper/extractName');
var defaultDelimiter = '/';


/**
 * Configuration is the interface between Settings and Configuration View.
 * 
 * Configuration Model:
 * 
 *   {
 *     title: 'Section',
 *     description: 'Section description',
 *     children:  {
 *       subSection: {
 *         title: 'Sub section',
 *         description: 'Sub section description',
 *         children: {
 *           'namespace/name': {
 *             title: 'Setting title',
 *             type: 'text',
 *             help: 'Help line',
 *             icon: 'Icon',
 *             defaultValue: 'default'
 *           }
 *         }
 *       }
 *     }
 *   }
 *
 * @param {Object} data
 * @returns {Configuration}
 */
var Configuration = function(data) {
  if (!(this instanceof Configuration)) {
    return new Configuration(data);
  }

  _.extend(this, data || {});
};

Configuration.prototype = _.create(Object.prototype, { constructor: Configuration });

/**
 * Retrieve configuration value.
 *
 * @param {string} name
 * @param {type} defaultValue
 * @returns {mixed}
 */
Configuration.prototype.get = function (name, defaultValue) {
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
Configuration.prototype.set = function (name, value) {
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


//var local = {};
//
//var Configuration = function(configuration) {
//  if (!(this instanceof Configuration)) {
//    return new Configuration(configuration);
//  }
//
//  _.extend(this, configuration);
//};
//Configuration.prototype = {};
//Configuration.prototype.constructor = Configuration;
//
//Configuration.prototype.get = function (namespace, name, defaultValue) {
//  if (_.isPlainObject(namespace)) {
//    defaultValue = namespace.defaultValue;
//    name = namespace.name;
//    var namespace = namespace.namespace;
//  }
//
//  var filter = { namespace: namespace, name: name };
////  var setting = dime.resources.setting.find(filter) || filter ;
////  if (false === _.isUndefined(setting.value)) {
////    return setting.value;
////  }
////  return (_.isUndefined(defaultValue)) ? null : defaultValue;
//};
//
//Configuration.prototype.namespace = function (namespace) {
////  var filter = { namespace: namespace };
////  return dime.resources.setting.filter(filter);
//};
//
//Configuration.prototype.getLocal = function (name, defaultValue) {
//  return local[name] || defaultValue;
//};
//
//Configuration.prototype.set = function (namespace, name, value) {
//  if (_.isPlainObject(namespace)) {
//    value = name;
//    name = namespace.name;
//    var namespace = namespace.namespace;
//  }
//  var filter = { namespace: namespace, name: name };
////  var setting = dime.resources.setting.find(filter) || filter;
////  setting.value = value;
////  dime.resources.setting.persist(setting);
//};
//
//Configuration.prototype.setLocal = function (name, value) {
//  local[name] = value;
//};

module.exports = new Configuration({
  general: {
    title: 'General',
    description: 'General Settings',
    children: {}
  }
});