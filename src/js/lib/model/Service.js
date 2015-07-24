'use strict';

var _ = require('lodash');
var Model = require('../Model');

var Service = function (data) {
  if (!(this instanceof Service)) {
    return new Service(data);
  }
  Model.call(this, _.extend({
    name: undefined,
    alias: undefined
  }, data || {}));
};

Service.prototype = _.create(Model.prototype, {
  constructor: Service,
  shortcut: ':',
  properties: {
    name: {
      type: 'text'
    },
    alias: {
      type: 'text'
    },
    rate: {
      type: 'number'
    },
    enabled: {
      type: 'boolean'
    }
  }
});

module.exports = Service;
