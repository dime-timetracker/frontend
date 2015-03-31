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
      if (_.isNaN(timeslice.duration)) {
        return prev + moment().diff(moment(timeslice.startedAt), "seconds");
      }
      return prev + parseInt(timeslice.duration);
    }, 0);
  };

  dime.modules.activity.model.prototype.startStopTimeslice = function () {
    if (this.running()) {
      var currentActivity = this;
      this.timeslices.forEach(function (currentTimeslice, idx) {
        if (_.isNull(currentTimeslice.stoppedAt) || _.isUndefined(currentTimeslice.stoppedAt)) {
          currentTimeslice.stoppedAt = moment().format('YYYY-MM-DD HH:mm:ss');
          currentActivity.timeslices[idx] = currentTimeslice;
          dime.resources.timeslice.persist(currentTimeslice);
        }
      });
    } else {
      var timeslice = {
        activity: this.id,
        startedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        stoppedAt: null
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
