'use strict';

var _ = require('lodash');
var Model = require('../Model');
var Customer = require('./Customer');
var customers = require('../collection/customers');

var Project = function (data) {
  if (!(this instanceof Project)) {
    return new Project(data);
  }
  
  _.extend(this, {
    name: undefined,
    alias: undefined
  }, data);

  this.customer = new Customer(this.customer);
};
Project.prototype = new Model();
Project.prototype.constructor = Project;

Project.shortcut = '/';

Project.properties = [
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
    key: 'customer',
    title: 'customer',
    type: 'relation',
    collection: customers
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
];

module.exports = Project;
