;(function (dime, Model, moment, _) {

  dime.model.Activity = function(data) {
    if (!(this instanceof dime.model.Activity)) {
        return new dime.model.Activity(data);
    }
    _.extend(this, data || {});

    if (this.timeslices !== undefined) {
      this.timeslices = new Collection({
        model: dime.model.Timeslice
      }, this.timeslices);
    }
  };

  dime.model.Activity.prototype = new Model();
  dime.model.Activity.prototype.constructor = dime.model.Activity;

  dime.model.Activity.prototype.running = function () {
    return this.timeslices.some(function (timeslice) {
      return _.isNull(timeslice.stoppedAt) || _.isUndefined(timeslice.stoppedAt);
    });
  };

  dime.model.Activity.prototype.runningTimeslice = function () {
    return this.timeslices.find(function (timeslice) {
      return null === timeslice.stoppedAt;
    });
  };

  dime.model.Activity.prototype.totalDuration = function () {
    return this.timeslices.reduce(function (prev, timeslice) {
      if (_.isNull(timeslice.duration) || this.duration === 0) {
        return prev + moment().diff(moment(timeslice.startedAt), "seconds");
      }
      return prev + parseInt(timeslice.duration);
    }, 0);
  };

  dime.model.Activity.prototype.startStopTimeslice = function () {
    var Activity = this;
    if (this.running()) {
      this.timeslices.forEach(function (timeslice, idx) {
        if (_.isNull(timeslice.stoppedAt) || _.isUndefined(timeslice.stoppedAt)) {
          timeslice.stoppedAt = moment().format('YYYY-MM-DD HH:mm:ss');
          timeslice.duration = moment(timeslice.stoppedAt).diff(moment(timeslice.startedAt), "seconds");
          dime.resources.timeslice.persist(timeslice).then(function (stoppedTimeslice) {
            Activity.timeslices[idx] = stoppedTimeslice;
          });
        }
      });
    } else {
      var timeslice = dime.resources.timeslice.empty({
        Activity: this.id,
        startedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      });
      dime.resources.timeslice.persist(timeslice).then(function (startedTimeslice) {
        Activity.timeslices.push(startedTimeslice);
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
    dime.resources.Activity.persist(this);
  };

  dime.model.Activity.prototype.removeTimeslice = function (timeslice) {
    var idx = this.timeslices.indexOf(timeslice);
    if (-1 < idx) {
      this.timeslices.splice(idx, 1);
      dime.resources.timeslice.remove(timeslice);
    }
    return timeslice;
  };

})(dime, Model, moment, _);