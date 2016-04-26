'use strict';

var m = require('src/lib/mithril');
var moment = require('moment');
var isNumber = require('lodash/lang/isNumber');

var duration = function (data, unit) {
  var content = '--:--:--';

  if (data !== undefined && isNumber(data) && data > 0) {
    var duration = moment.duration(data, unit || 'seconds');

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

    content = [hours, minute, second].join(':');
  }

  return m('span.duration', content);
};

module.exports = duration;
