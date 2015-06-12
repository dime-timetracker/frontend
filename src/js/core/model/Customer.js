'use strict';

var _ = require('lodash');
var Model = require('../Model');

var Customer = function (data) {
  if (!(this instanceof Customer)) {
    return new Customer(data);
  }
  _.extend(this, {
    name: undefined,
    alias: undefined
  }, data);
};
Customer.prototype = new Model();
Customer.prototype.constructor = Customer;

Customer.shortcut = '@';
Customer.properties = function (model) {
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

module.exports = Customer;