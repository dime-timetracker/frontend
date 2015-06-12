'use strict';

var _ = require('lodash');
var Model = require('../Model');

var Service = function (data) {
  if (!(this instanceof Service)) {
    return new Service(data);
  }
  _.extend(this, data || {});
};

Service.prototype = new Model();
Service.prototype.constructor = Service;

Service.shortcut = ':';

Service.properties = function (model) {
  var context = {
    model: model,
    properties: [
      {
        key: 'name',
        title: 'name',
        type: 'text'
      },
      {
        key: 'alias',
        title: 'alias',
        type: 'text'
      },
      {
        key: 'rate',
        title: 'rate',
        type: 'number'
      },
      {
        key: 'enabled',
        title: 'enabled',
        type: 'boolean'
      }
    ]
  };
  return context.properties;
};

module.exports = Service;