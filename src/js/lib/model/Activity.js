'use strict';

var _ = require('lodash');
var t = require('../../lib/translation');
var moment = require('moment');
var Model = require('../Model');
var Customer = require('./Customer');
var customers = require('../collection/customers');
var Project = require('./Project');
var projects = require('../collection/projects');
var Service = require('./Service');
var services = require('../collection/services');
var TimesliceCollection = require('../collection/Timeslices');
var TagCollection = require('../collection/Tags');

var Activity = function (data) {
  if (!(this instanceof Activity)) {
    return new Activity(data);
  }

  Model.call(this, _.extend({
    description: t('(Click here to enter a description!)'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
  }, data));

  if (this.customer) {
    this.customer = new Customer(this.customer);
  }
  if (this.project) {
    this.project = new Project(this.project);
  }
  if (this.service) {
    this.service = new Service(this.service);
  }

  this.tags = new TagCollection(this.tags);

  this.timeslices = new TimesliceCollection(this.timeslices);
};
Activity.prototype = _.create(Model.prototype, {
  constructor: Activity,
  properties: {
    description: {},
    customer: {
      type: 'relation',
      collection: customers
    },
    project: {
      type: 'relation',
      collection: projects
    },
    service: {
      type: 'relation',
      collection: services
    },
    rate: {
      type: 'number'
    }
  }
});

Activity.prototype.onSwitchRelation = function (relation, item) {
  this[relation] = item;
  switch (relation) {
    case 'customer':
      if (this.project) {
        // reset project after selecting a different customer
        if (this.project.customer &&
            this.project.customer.alias &&
            this.project.customer.alias !== relation.alias) {
          this.project = null;
        }
        // assign customer to project, if it has none
        if (this.customer &&
            _.isObject(this.project.customer) &&
            '' === this.project.customer.alias) {
          this.project.customer = this.customer;
        }
      }
//      dime.resources.activity.persist(this);
      break;
    case 'project':
      if (item.customer && item.customer.alias) {
        this.customer = item.customer;
      }
      if (!_.isNull(this.project) && (!item.customer || '' === item.customer.alias)) {
        this.project.customer = this.customer;
      }
//      dime.resources.activity.persist(this);
      break;
  }
  if (this.customer) {
    this.rate = this.customer.rate;
  }
  if (this.project) {
    this.rate = this.project.rate;
  }
};

Activity.prototype.hasCustomer = function () {
  return _.isObject(this.customer) &&
          _.isString(this.customer.alias) &&
          0 < this.customer.alias.length;
};

Activity.prototype.hasProject = function () {
  return _.isObject(this.project) &&
          _.isString(this.project.alias) &&
          0 < this.project.alias.length;
};

Activity.prototype.hasService = function () {
  return _.isObject(this.service) &&
          _.isString(this.service.alias) &&
          0 < this.service.alias.length;
};

Activity.prototype.isRunning = function () {
  return this.timeslices.hasRunning();
};

Activity.prototype.findRunningTimeslice = function () {
  return this.timeslices.findRunningTimeslice();
};

Activity.prototype.totalDuration = function () {
  return this.timeslices.reduce(function (prev, timeslice) {
    return prev + timeslice.getDuration();
  }, 0);
};

Activity.prototype.start = function () {
  var timeslice = this.timeslices.modelize({
    activity: parseInt(this.id) // we could submit the whole activity, but this is not required here
  });
  this.timeslices.persist(timeslice);
};

Activity.prototype.stop = function () {
  var timeslice = this.timeslices.findRunningTimeslice();
  if (timeslice) {
    timeslice.setEnd();
    timeslice.updateDuration();
    this.timeslices.persist(timeslice);
  }
};

Activity.prototype.addTimeslice = function (timeslice) {
  if (timeslice) {
      this.timeslices.persist(timeslice);
  }
  return timeslice;
};

Activity.prototype.removeTimeslice = function (timeslice) {
  if (timeslice) {
    this.timeslices.remove(timeslice);
  }
  return timeslice;
};

Activity.prototype.toString = function () {
  return this.description;
};

module.exports = Activity;
