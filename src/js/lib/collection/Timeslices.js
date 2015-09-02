'use strict';

var create = require('lodash/object/create');

var moment = require('moment');
var Collection = require('../Collection');
var Timeslice = require('../model/Timeslice');

var Timeslices = function (data) {
  if (!(this instanceof Timeslices)) {
    return new Timeslices(data);
  }

  Collection.call(this, {
    resourceUrl: 'timeslice',
    model: Timeslice,
    compare: function (a,b) {
      var result = 0;
      if (a > b) {
        result = -1;
      } else if (a < b) {
        result = 1;
      }
      return result;
    },
    compareKey: function (obj) {
      var date = obj.stoppedAt || obj.startedAt;
      return parseInt(moment(date).format('x'));
    }
  }, data);
};

Timeslices.prototype = create(Collection.prototype, {
  constructor: Timeslices
});

Timeslices.prototype.hasRunning = function () {
  return this.some(function (timeslice) {
    return timeslice.isRunning();
  });
};

Timeslices.prototype.findRunningTimeslice = function () {
  return this.find(function (timeslice) {
    return timeslice.isRunning();
  });
};

module.exports = Timeslices;
