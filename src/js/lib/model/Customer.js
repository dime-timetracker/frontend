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
  }, data));
};

Customer.prototype = _.create(Model.prototype, {
  constructor: Customer,
  shortcut: '@',
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

Customer.prototype.toString = function () {
  return this.name;
};

module.exports = Customer;
