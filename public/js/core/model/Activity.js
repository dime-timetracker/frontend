'use strict';

dime.model.Activity = function(data) {
  if (!(this instanceof dime.model.Activity)) {
      return new dime.model.Activity(data);
  }
  _.extend(this, data || {});

  if (this.timeslices !== undefined) {
    this.timeslices = new dime.Collection({
      model: dime.model.Timeslice
    }, this.timeslices);
  }
};

dime.model.Activity.properties = function properties (model) {
  var context = {
    model: model,
    properties: [
      {
        key: 'description',
        title: 'description',
        type: 'text'
      },
      {
        key: 'customer',
        title: 'customer',
        type: 'relation'
      },
      {
        key: 'project',
        title: 'project',
        type: 'relation'
      },
      {
        key: 'service',
        title: 'service',
        type: 'relation'
      },
      {
        key: 'tags',
        title: 'tags',
        type: 'tags'
      }
    ]
  };
  dime.events.emit('model-activity-properties', context);
  return context.properties;
}

dime.model.Activity.prototype = new dime.Model();
dime.model.Activity.prototype.constructor = dime.model.Activity;

dime.model.Activity.prototype.onSwitchRelation = function(relation, item) {
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
          && "" == this.project.customer.alias
        ) {
          this.project.customer = this.customer;
        }
      }
      dime.resources.activity.persist(this);
    case 'project':
      if (item.customer && item.customer.alias) {
        this.customer = item.customer;
      }
      if (!item.customer || "" == item.customer.alias) {
        this.project.customer = this.customer;
      }
      dime.resources.activity.persist(this);
  }
}

dime.model.Activity.prototype.hasCustomer = function () {
  return _.isObject(this.customer)
    && _.isString(this.customer.alias)
    && 0 < this.customer.alias.length;
};

dime.model.Activity.prototype.hasProject = function () {
  return _.isObject(this.project)
    && _.isString(this.project.alias)
    && 0 < this.project.alias.length;
};

dime.model.Activity.prototype.hasService = function () {
  return _.isObject(this.service)
    && _.isString(this.service.alias)
    && 0 < this.service.alias.length;
};

dime.model.Activity.prototype.running = function () {
  return this.timeslices.some(function (timeslice) {
    return timeslice.isRunning();
  });
};

dime.model.Activity.prototype.runningTimeslice = function () {
  return this.timeslices.find(function (timeslice) {
    return timeslice.isRunning();
  });
};

dime.model.Activity.prototype.totalDuration = function () {
  return this.timeslices.reduce(function (prev, timeslice) {
    return prev + timeslice.totalDuration();
  }, 0);
};

dime.model.Activity.prototype.startStopTimeslice = function () {
  var activity = this;
  if (this.running()) {
    this.timeslices.forEach(function (timeslice, idx) {
      if (timeslice.isRunning()) {
        timeslice.stoppedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        timeslice.duration = moment(timeslice.stoppedAt).diff(moment(timeslice.startedAt), 'seconds');
        dime.resources.timeslice.persist(timeslice).then(function (stoppedTimeslice) {
          activity.timeslices[idx] = new dime.model.Timeslice(stoppedTimeslice);
        });
      }
    });
  } else {
    var timeslice = new dime.model.Timeslice({
      activity: parseInt(activity.id) // we could submit the whole activity, but this is not required here
    });
    dime.resources.timeslice.persist(timeslice).then(function (startedTimeslice) {
      activity.timeslices.add(startedTimeslice);
    });
  }
};

dime.model.Activity.prototype.toggleTimeslices = function () {
  if (_.isUndefined(this.showTimeslices)) {
    this.showTimeslices = false;
  }
  this.showTimeslices = !this.showTimeslices;
};

dime.model.Activity.prototype.updateDescription = function (description) {
  this.description = description;
  dime.resources.activity.persist(this);
};

dime.model.Activity.prototype.removeTimeslice = function (timeslice) {
  var idx = this.timeslices.indexOf(timeslice);
  if (-1 < idx) {
    this.timeslices.splice(idx, 1);
    dime.resources.timeslice.remove(timeslice);
  }
  return timeslice;
};
