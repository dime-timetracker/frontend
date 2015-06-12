'use strict';

var _ = require('lodash');
var Model = require('../Model');
var Customer = require('./Customer');

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

Project.properties = function (model) {
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
        key: 'customer',
        title: 'customer',
        type: 'relation',
        resource: 'customer'
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

module.exports = Project;
