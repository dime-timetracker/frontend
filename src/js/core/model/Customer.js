'use strict';

var _ = require('lodash');
var Model = require('../Model');

var Customer = function (data) {
  if (!(this instanceof Customer)) {
    return new Customer(data);
  }

  Model.call(this, _.extend({
    name: undefined,
    alias: undefined
  }, data || {}));
};
Customer.prototype = _.create(Model.prototype, {
  constructor: Customer,
  shortcut: '@',
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

module.exports = Customer;