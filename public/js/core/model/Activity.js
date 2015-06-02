(function (dime, _, moment) {
  'use strict';

  var Activity = function (data) {
    if (!(this instanceof Activity)) {
      return new Activity(data);
    }
    _.extend(this, {
      description: t('(Click here to enter a description!)'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    }, data);

    this.tags = new dime.Collection({
      resourceUrl: 'tag',
      model: dime.model.Tag
    }, this.tags || []);

    this.timeslices = new dime.Collection({
      resourceUrl: "timeslice",
      model: dime.model.Timeslice
    }, this.timeslices || []);
  };
  Activity.prototype = new dime.Model();
  Activity.prototype.constructor = Activity;

  dime.model.Activity = Activity;

  Activity.properties = function properties(model) {
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
  };

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
                  && "" == this.project.customer.alias
                  ) {
            this.project.customer = this.customer;
          }
        }
        dime.resources.activity.persist(this);
        break;
      case 'project':
        if (item.customer && item.customer.alias) {
          this.customer = item.customer;
        }
        if (!_.isNull(this.project) && (!item.customer || "" == item.customer.alias)) {
          this.project.customer = this.customer;
        }
        dime.resources.activity.persist(this);
        break;
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
      this.timeslices.forEach(function (timeslice, idx) {
        if (timeslice.isRunning()) {
          timeslice.stoppedAt = moment().format('YYYY-MM-DD HH:mm:ss');
          timeslice.duration = moment(timeslice.stoppedAt).diff(moment(timeslice.startedAt), 'seconds');
          activity.timeslices.persist(timeslice);
        }
      });
    } else {
      var timeslice = this.timeslices.create({
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
    dime.resources.activity.persist(this);
  };

  Activity.prototype.addTimeslice = function (timeslice) {
    timeslice = timeslice || this.timeslices.create({
      activity: parseInt(this.id) // we could submit the whole activity, but this is not required here
    });
    this.timeslices.persist(timeslice);
    return timeslice;
  };

  Activity.prototype.removeTimeslice = function (timeslice) {
    this.timeslices.remove(timeslice);
    return timeslice;
  };

})(dime, _, moment);

