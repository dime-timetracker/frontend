'use strict';

var create = require('lodash/object/create');
var extend = require('lodash/object/extend');
var Model = require('../Model');
var Customer = require('./Customer');
var customers = require('../collection/customers');

var Project = function (data) {
  if (!(this instanceof Project)) {
    return new Project(data);
  }

  Model.call(this, extend({
    name: undefined,
    alias: undefined
  }, data || {}));

  this.customer = new Customer(this.customer);
};
Project.prototype = create(Model.prototype, {
  constructor: Project,
  shortcut: '/',
  properties: {
    name: {},
    customer: {
      type: 'relation',
      collection: customers
    },
    description: {},
    alias: {},
    enabled: {
      type: 'boolean'
    },
    rate: {
      type: 'number'
    },
    budgetPrice: {
      type: 'number'
    },
    budgetTime: {
      type: 'number'
    },
    isBudgetFixed: {
      type: 'number'
    }
  }
});

Project.prototype.toString = function () {
  return this.name;
};

module.exports = Project;
