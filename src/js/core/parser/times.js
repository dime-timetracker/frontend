'use strict';

// TODO: refactor!!!

var moment = require('moment');
var isEmpty = require('lodash/lang/isEmpty');

module.exports = function (obj) {
  var start = null;
  var stop = null;

  // 01:23-03:49 (start and stop given)
  var regex = /(\d+:\d{2})-(\d+:\d{2})/;
  var matches = obj._text.match(regex);
  if (null != matches) {
    start = moment(moment().format('YYYY-MM-DD ') + matches[1]);
    stop  = moment(moment().format('YYYY-MM-DD ') + matches[2]);
    while (stop.isBefore(start)) {
      start = start.subtract(1, 'day');
    }
  } else {
    // -01:23 (only stop time given, starting now)
    regex = /(-(\d+):(\d{2})h?)/;
    matches = obj._text.match(regex);
    if (null != matches) {
      start = moment();
      stop = moment();
      stop.hours(matches[2]);
      stop.minutes(matches[3]);
      while (stop.isBefore(start)) {
        stop = stop.add(1, 'day');
      }
    } else {
      // 01:23- (only start time given, stopping now)
      regex = /((\d+):(\d{2})h?-)/;
      matches = obj._text.match(regex);
      if (null != matches) {
        stop = moment();
        start = moment().hours(matches[2])
          .minutes(matches[3]);
        while (stop.isBefore(start)) {
          start = start.subtract(1, 'day');
        }
      } else {
        // 01:23 (duration given, stopping now)
        var hours = 0;
        var minutes = 0;
        regex = /((\d+):(\d{2})h?)/;
        matches = obj._text.match(regex);
        if (null != matches) {
            hours = matches[2];
            minutes = matches[3];
        } else {
          regex = /(^| )((\d+)h( ?(\d+)m)?)/;
          matches = obj._text.match(regex);
          if (null != matches) {
            hours = matches[3];
            minutes = matches[5];
          } else {
            regex = /(^| )(\d+)([\.,](\d+))?h/;
            matches = obj._text.match(regex);
            if (null == matches) {
              return obj;
            }
            hours = matches[2];
            minutes = matches[4]/10 * 60;
          }
        }
        start = moment();
        start.subtract(hours, 'hours');
        start.subtract(minutes, 'minutes');
        stop  = moment();
      }
    }
  }

  var timeslice = {};
  if (start !== null) {
    timeslice.startedAt = moment(start).format('YYYY-MM-DD HH:mm');
  }
  if (stop !== null) {
    timeslice.stoppedAt = moment(stop).format('YYYY-MM-DD HH:mm');
  }
  if (!isEmpty(timeslice)) {
    obj.timeslices = [ timeslice ];
  }

  // cut off parsed time
  obj._text = obj._text.replace(regex, '');
  return obj;
};
