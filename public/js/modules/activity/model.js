'use strict';
(function (dime, moment, _) {

  dime.modules.activity.model.prototype.running = function () {
    return this.timeslices.some(function (timeslice) {
      return null === timeslice.stoppedAt;
    });
  };

  dime.modules.activity.model.prototype.runningTimeslice = function () {
    return this.timeslices.find(function (timeslice) {
      return null === timeslice.stoppedAt;
    });
  };

  dime.modules.activity.model.prototype.totalDuration = function () {
    return this.timeslices.reduce(function (prev, timeslice) {
      if (_.isNull(timeslice.duration)) {
        return prev + moment().diff(moment(timeslice.startedAt), "seconds");
      }
      return prev + parseInt(timeslice.duration);
    }, 0);
  };

  dime.modules.activity.model.prototype.startStopTimeslice = function () {
    if (this.running()) {
      var currentActivity = this;
      this.timeslices.forEach(function (timeslice, idx) {
        if (_.isNull(timeslice.stoppedAt) || _.isUndefined(timeslice.stoppedAt)) {
          timeslice.stoppedAt = moment().format('YYYY-MM-DD HH:mm:ss');
          timeslice.duration = moment(timeslice.stoppedAt).diff(moment(timeslice.startedAt), "seconds");
          currentActivity.timeslices[idx] = timeslice;
          dime.resources.timeslice.persist(timeslice);
        }
      });
    } else {
      var timeslice = {
        activity: this.id,
        startedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        stoppedAt: null,
        duration: null
      };
      this.timeslices.push(timeslice);
      dime.resources.timeslice.persist(timeslice);
    }
  };

  dime.modules.activity.model.prototype.toggleTimeslices = function () {
    if (_.isUndefined(this.showTimeslices)) {
      this.showTimeslices = false;
    }
    this.showTimeslices = !this.showTimeslices;
  };

  dime.modules.activity.model.prototype.updateDescription = function (description) {
    this.description = description;
    dime.resources.activity.persist(this);
  }

})(dime, moment, _);
