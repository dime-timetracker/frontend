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
      if (_.isNumber(timeslice.duration)) {
        return prev + timeslice.duration;
      }
      return prev + moment().diff(moment(timeslice.startedAt), "seconds");
    }, 0);
  };

  dime.modules.activity.model.prototype.startStopTimeslice = function () {
    if (this.running()) {
      this.timeslices.forEach(function (currentTimeslice) {
        if (_.isNull(currentTimeslice.stoppedAt) || _.isUndefined(currentTimeslice.stoppedAt)) {
          currentTimeslice.stoppedAt = moment().format('YYYY-MM-DD HH:mm:ss');
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

})(dime, moment, _);
