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

dime.model.Activity.prototype = new dime.Model();
dime.model.Activity.prototype.constructor = dime.model.Activity;

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
      if (timslice.isRunning()) {
        timeslice.stoppedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        timeslice.duration = moment(timeslice.stoppedAt).diff(moment(timeslice.startedAt), 'seconds');
        dime.resources.timeslice.persist(timeslice).then(function (stoppedTimeslice) {
          activity.timeslices[idx] = new dime.model.Timeslice(stoppedTimeslice);
        });
      }
    });
  } else {
    var timeslice = new dime.model.Timeslice({
      activity: activity.id
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
