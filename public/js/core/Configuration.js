;(function (dime) {
  'use strict';

  var Configuration = function(configuration) {
    if (!(this instanceof Configuration)) {
      return new Configuration(configuration);
    }

    _.extend(this, {}, configuration);

    this.local = {};
  };
  Configuration.prototype = new Object();
  Configuration.prototype.constructor = Configuration;

  dime.Configuration = Configuration;

  Configuration.prototype.get = function (namespace, name, defaultValue) {
    if (_.isPlainObject(namespace)) {
      defaultValue = namespace.defaultValue;
      name = namespace.name;
      var namespace = namespace.namespace;
    }
    var filter = { namespace: namespace, name: name };
    var setting = dime.resources.setting.find(filter) || filter ;
    if (false === _.isUndefined(setting.value)) {
      return setting.value;
    }
    return (_.isUndefined(defaultValue)) ? null : defaultValue;
  };

  Configuration.prototype.set = function (namespace, name, value) {
    if (_.isPlainObject(namespace)) {
      value = name;
      name = namespace.name;
      var namespace = namespace.namespace;
    }
    var filter = { namespace: namespace, name: name };
    var setting = dime.resources.setting.find(filter) || filter;
    setting.value = value;
    dime.resources.setting.persist(setting);
  };

//  // transient store for temporary settings
//  Configuration.local = {};

  // Create setting collection
  dime.resources.setting = new dime.Collection({
    url: 'setting',
    model: dime.model.Setting
  });
  dime.resources.setting.fetch();

  dime.configuration = new Configuration({
    general: {
      title: 'General',
      description: 'General Settings',
      children: { }
    }
  });

})(dime);
