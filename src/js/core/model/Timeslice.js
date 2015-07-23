'use strict';

var create = require('lodash/object/create');
var extend = require('lodash/object/extend');
var isUndefined = require('lodash/lang/isUndefined');
var isNull = require('lodash/lang/isNull');
var isNumber = require('lodash/lang/isNumber');
var definedAndNotNull = require('../helper/definedAndNotNull');

var moment = require('moment');
var Model = require('../Model');

var Timeslice = function (data) {
  if (!(this instanceof Timeslice)) {
    return new Timeslice(data);
  }

  Model.call(this, extend({
    startedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
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

Timeslice.prototype.start = function () {
  return moment(this.startedAt);
};

Timeslice.prototype.duration = function () {
  var result = 0;

  if (isNull(this.duration) || this.duration === 0) {
    result = this.end().diff(this.start(), 'seconds');
  } else {
    result = parseInt(this.duration);
  }

  return result;
};

Timeslice.prototype.end = function () {
  return definedAndNotNull(this.stoppedAt) ? moment(this.stoppedAt) : moment();
};

Timeslice.prototype.totalDuration = function (precision) {
  var result = 0;

  if (isNull(this.duration) || this.duration === 0) {
    result = this.end().diff(this.start(), 'seconds');
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

Timeslice.prototype.isRunning = function () {
  return !definedAndNotNull(this.stoppedAt);
};

Timeslice.prototype.sameDay = function () {
  return 1 > this.end().diff(this.start(), 'days');
};

module.exports = Timeslice;
