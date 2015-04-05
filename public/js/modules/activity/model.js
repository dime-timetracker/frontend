'use strict';
(function (dime, moment, _) {

  dime.modules.activity.model.prototype.running = function () {
    return this.timeslices.some(function (timeslice) {
      return _.isNull(timeslice.stoppedAt) || _.isUndefined(timeslice.stoppedAt);
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
    var activity = this;
    if (this.running()) {
      this.timeslices.forEach(function (timeslice, idx) {
        if (_.isNull(timeslice.stoppedAt) || _.isUndefined(timeslice.stoppedAt)) {
          timeslice.stoppedAt = moment().format('YYYY-MM-DD HH:mm:ss');
          timeslice.duration = moment(timeslice.stoppedAt).diff(moment(timeslice.startedAt), "seconds");
          dime.resources.timeslice.persist(timeslice).then(function (stoppedTimeslice) {
            activity.timeslices[idx] = stoppedTimeslice;
          });
        }
      });
    } else {
      var timeslice = dime.resources.timeslice.empty({
        activity: this.id,
        startedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      });
      dime.resources.timeslice.persist(timeslice).then(function (startedTimeslice) {
        activity.timeslices.push(startedTimeslice);
      });
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

  dime.modules.activity.model.prototype.removeTimeslice = function (timeslice) {
    var idx = this.timeslices.indexOf(timeslice);
    if (-1 < idx) {
      this.timeslices.splice(idx, 1);
      dime.resources.timeslice.remove(timeslice);
    }
    return timeslice;
  }

})(dime, moment, _);
