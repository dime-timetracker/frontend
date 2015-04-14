'use strict';

dime.model.Timeslice = function(data) {
  if (!(this instanceof dime.model.Timeslice)) {
      return new dime.model.Timeslice(data);
  }
  _.extend(this, {
    startedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    duration: 0
  }, data);
};

dime.model.Timeslice.prototype = new dime.Model();
dime.model.Timeslice.prototype.constructor = dime.model.Timeslice;

dime.model.Timeslice.prototype.totalDuration = function (precision) {
  var result = 0;

  if (_.isNull(this.duration) || this.duration === 0) {
      result = moment().diff(moment(this.startedAt), "seconds");
  } else {
    result = parseInt(this.duration);
  }

  if (!_.isUndefined(precision) && _.isNumber(precision) &&  precision > 0) {
    result = Math.ceil(result / precision) * precision;
  }

  return result;
};

dime.model.Timeslice.prototype.isRunning = function () {
  return _.isNull(this.stoppedAt) || _.isUndefined(this.stoppedAt);
};