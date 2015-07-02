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
});

module.exports = Service;