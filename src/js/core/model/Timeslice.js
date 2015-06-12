'use strict';

var _ = require('lodash');
var moment = require('moment');
var Model = require('../Model');

var Timeslice = function (data) {
  if (!(this instanceof Timeslice)) {
    return new Timeslice(data);
  }
  _.extend(this, {
    startedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    duration: 0
  }, data);
};

Timeslice.prototype = new Model();
Timeslice.prototype.constructor = Timeslice;

Timeslice.prototype.totalDuration = function (precision) {
  var result = 0;

  if (_.isNull(this.duration) || this.duration === 0) {
    result = moment().diff(moment(this.startedAt), "seconds");
  } else {
    result = parseInt(this.duration);
  }

  if (!_.isUndefined(precision)) {
    precision = parseInt(precision);
    if (_.isNumber(precision) && 0 < precision) {
      result = Math.ceil(result / precision) * precision;
    }
  }

  return result;
};

Timeslice.prototype.isRunning = function () {
  return _.isNull(this.stoppedAt) || _.isUndefined(this.stoppedAt);
};

module.exports = Timeslice;