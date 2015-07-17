'use strict';

var _ = require('lodash');
var t = require('../../translation');
var moment = require('moment');
var Collection = require('../Collection');
var Model = require('../Model');
var Customer = require('./Customer');
var customers = require('../collection/customers');
var Project = require('./Project');
var projects = require('../collection/projects');
var Service = require('./Service');
var services = require('../collection/services');
var Timeslice = require('./Timeslice');
var Tag = require('./Tag');

var Activity = function (data) {
  if (!(this instanceof Activity)) {
    return new Activity(data);
  }

  Model.call(this, _.extend({
    description: t('(Click here to enter a description!)'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
  }, data || {}));

  if (this.customer) {
    this.customer = new Customer(this.customer);
  }
  if (this.project) {
    this.project = new Project(this.project);
  }
  if (this.service) {
    this.service = new Service(this.service);
  }

  this.tags = new Collection({
    resourceUrl: 'tag',
    model: Tag
  }, this.tags || []);

  this.timeslices = new Collection({
    resourceUrl: 'timeslice',
    model: Timeslice,
    compare: function (a,b) {
      var result = 0;
      if (a > b) {
        result = -1;
      } else if (a < b) {
        result = 1;
      }
      return result;
    },
    compareKey: function (obj) {
      return parseInt(moment(obj.stoppedAt || obj.startedAt || obj.updatedAt || obj.createdAt).format('x'));
    }
  }, this.timeslices || []);
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
        if (this.project.customer
                && this.project.customer.alias
                && this.project.customer.alias !== relation.alias
                ) {
          this.project = null;
        }
        // assign customer to project, if it has none
        if (this.customer
                && _.isObject(this.project.customer)
                && '' == this.project.customer.alias
                ) {
          this.project.customer = this.customer;
        }
      }
//      dime.resources.activity.persist(this);
      break;
    case 'project':
      if (item.customer && item.customer.alias) {
        this.customer = item.customer;
      }
      if (!_.isNull(this.project) && (!item.customer || '' == item.customer.alias)) {
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
  return _.isObject(this.customer)
          && _.isString(this.customer.alias)
          && 0 < this.customer.alias.length;
};

Activity.prototype.hasProject = function () {
  return _.isObject(this.project)
          && _.isString(this.project.alias)
          && 0 < this.project.alias.length;
};

Activity.prototype.hasService = function () {
  return _.isObject(this.service)
          && _.isString(this.service.alias)
          && 0 < this.service.alias.length;
};

Activity.prototype.running = function () {
  return this.timeslices.some(function (timeslice) {
    return timeslice.isRunning();
  });
};

Activity.prototype.runningTimeslice = function () {
  return this.timeslices.find(function (timeslice) {
    return timeslice.isRunning();
  });
};

Activity.prototype.totalDuration = function () {
  return this.timeslices.reduce(function (prev, timeslice) {
    return prev + timeslice.totalDuration();
  }, 0);
};

Activity.prototype.startStopTimeslice = function () {
  var activity = this;
  if (this.running()) {
//    dime.states.activity.change('normal');
    this.timeslices.forEach(function (timeslice, idx) {
      if (timeslice.isRunning()) {
        timeslice.stoppedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        timeslice.duration = moment(timeslice.stoppedAt).diff(moment(timeslice.startedAt), 'seconds');
        activity.timeslices.persist(timeslice);
      }
    });
  } else {
//    dime.states.activity.change('running');
    var timeslice = this.timeslices.modelize({
      activity: parseInt(activity.id) // we could submit the whole activity, but this is not required here
    });
    activity.timeslices.persist(timeslice);
  }
};

Activity.prototype.toggleTimeslices = function () {
  if (_.isUndefined(this.showTimeslices)) {
    this.showTimeslices = false;
  }
  this.showTimeslices = !this.showTimeslices;
};

Activity.prototype.updateDescription = function (description) {
  this.description = description;
};

Activity.prototype.addTimeslice = function (timeslice) {
  timeslice = timeslice || this.timeslices.modelize({
    activity: parseInt(this.id) // we could submit the whole activity, but this is not required here
  });
  this.timeslices.persist(timeslice);
  return timeslice;
};

Activity.prototype.removeTimeslice = function (timeslice) {
  this.timeslices.remove(timeslice);
  return timeslice;
};

module.exports = Activity;
