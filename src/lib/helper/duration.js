'use strict';

var moment = require('moment');
var isNumber = require('lodash/isNumber');

/**
 * Format duration.
 *
 * Example:
 *
 * duration(3600, 'seconds') => 01:00:00
 *
 * @param {Number} data
 * @param {String} unit base unit of data
 * @returns {String}
 */
var duration = function (data, unit) {
  if (data !== undefined && isNumber(data)) {
    unit = unit || 'seconds';
    var duration = moment.duration(data, unit);

    var hours = Math.floor(duration.asHours()),
            minute = duration.minutes(),
            second = duration.seconds();

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minute < 10) {
      minute = '0' + minute;
    }
    if (second < 10) {
      second = '0' + second;
    }

    return [hours, minute, second].join(':');
  }
  return '';
};

module.exports = duration;
