'use strict';

var create = require('lodash/object/create');
var extend = require('lodash/object/extend');
var isUndefined = require('lodash/lang/isUndefined');
var isNull = require('lodash/lang/isNull');
var isNumber = require('lodash/lang/isNumber');
var definedAndNotNull = require('../helper/definedAndNotNull');

var moment = require('moment');
var Model = require('../Model');

var timestampFormat = 'YYYY-MM-DD HH:mm:ss';

var Timeslice = function (data) {
  if (!(this instanceof Timeslice)) {
    return new Timeslice(data);
  }

  Model.call(this, extend({
    startedAt: moment().format(timestampFormat),
    duration: 0
  }, data));
};

Timeslice.prototype = create(Model.prototype, {
  constructor: Timeslice,
  properties: {
    startedAt: {
      type: 'datetime'
    },
    stoppedAt: {
      type: 'datetime'
    }
  }
});

Timeslice.prototype.getStart = function () {
  return moment(this.startedAt);
};

Timeslice.prototype.setStart = function (datetime) {
  this.startedAt = moment(datetime).format(timestampFormat);
};

Timeslice.prototype.setStartDate = function (date) {
  var newDate = moment(date);

  this.startedAt = this.getStart()
    .date(newDate.date())
    .month(newDate.month())
    .year(newDate.year())
    .format(timestampFormat);
};

Timeslice.prototype.setStartTime = function (time) {
  var newTime = moment(this.getStart().format('YYYY-MM-DD ') + time);

  this.startedAt = this.getStart()
    .hour(newTime.hour())
    .minute(newTime.minute())
    .second(newTime.second())
    .format(timestampFormat);
};

Timeslice.prototype.getDuration = function (precision) {
  var result = 0;

  if (isNull(this.duration) || this.duration === 0) {
    result = this.end().diff(this.getStart(), 'seconds');
  } else {
    result = parseInt(this.duration);
  }

  if (!isUndefined(precision)) {
    precision = parseInt(precision);
    if (isNumber(precision) && 0 < precision) {
      result = Math.ceil(result / precision) * precision;
    }
  }

  return result;
};

Timeslice.prototype.getEnd = function () {
  return definedAndNotNull(this.stoppedAt) ? moment(this.stoppedAt) : moment();
};


Timeslice.prototype.setEnd = function (datetime) {
  this.stoppedAt = moment(datetime).format(timestampFormat);
};

Timeslice.prototype.setEndDate = function (date) {
  var newDate = moment(date);

  this.stoppedAt = this.getEnd()
    .date(newDate.date())
    .month(newDate.month())
    .year(newDate.year())
    .format(timestampFormat);
};

Timeslice.prototype.setEndTime = function (time) {
  var newTime = moment(this.getEnd().format('YYYY-MM-DD ') + time);

  this.stoppedAt = this.getEnd()
    .hour(newTime.hour())
    .minute(newTime.minute())
    .second(newTime.second())
    .format(timestampFormat);
};

Timeslice.prototype.isRunning = function () {
  return !definedAndNotNull(this.stoppedAt);
};

Timeslice.prototype.isSameDay = function () {
  return 1 > this.getEnd().diff(this.getStart(), 'days');
};

module.exports = Timeslice;
