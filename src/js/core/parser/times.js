'use strict';

// TODO: refactor!!!

var moment = require('moment');
var isEmpty = require('lodash/lang/isEmpty');

function parseStartStop (obj) {
  // 01:23-03:49 (start and stop given)
  var regex = /(\d+:\d{2})-(\d+:\d{2})/;
  var matches = obj._text.match(regex);
  if (null !== matches) {
    obj._start = moment(moment().format('YYYY-MM-DD ') + matches[1]);
    obj._stop  = moment(moment().format('YYYY-MM-DD ') + matches[2]);
    while (obj._stop.isBefore(obj._start)) {
      obj._start = obj._start.subtract(1, 'day');
    }
    return regex;
  }
}

function parseStopOnly (obj) {
  // -01:23 (only stop time given, starting now)
  var regex = /(-(\d+):(\d{2})h?)/;
  var matches = obj._text.match(regex);
  if (null !== matches) {
    obj._start = moment();
    obj._stop = moment();
    obj._stop.hours(matches[2]);
    obj._stop.minutes(matches[3]);
    while (obj._stop.isBefore(obj._start)) {
      obj._stop = obj._stop.add(1, 'day');
    }
    return regex;
  }
}

function parseStartOnly (obj) {
  // 01:23- (only start time given, stopping now)
  var regex = /((\d+):(\d{2})h?-)/;
  var matches = obj._text.match(regex);
  if (null != matches) {
    obj._stop = moment();
    obj._start = moment().hours(matches[2])
      .minutes(matches[3]);
    while (obj._stop.isBefore(obj._start)) {
      obj._start = obj._start.subtract(1, 'day');
    }
    return regex;
  }
}

function parseDuration (obj) {
  // duration given, stopping now
  var hours = 0;
  var minutes = 0;
  // 01:06 || 01:06h
  var regex = /((\d+):(\d{2})h?)/;
  var matches = obj._text.match(regex);
  if (null !== matches) {
    hours = matches[2];
    minutes = matches[3];
  } else {
    // 01h 06m
    regex = /(^| )((\d+)h( ?(\d+)m)?)/;
    matches = obj._text.match(regex);
    if (null !== matches) {
      hours = matches[3];
      minutes = matches[5];
    } else {
      // 1,1 || 1,1h || 1.1 || 1.1h
      regex = /(^| )(\d+)([\.,](\d+))?h/;
      matches = obj._text.match(regex);
      if (null !== matches) {
        hours = matches[2];
        minutes = matches[4]/10 * 60;
      }
    }
  }
  if (0 < hours || 0 < minutes) {
    obj._start = moment();
    obj._start.subtract(hours, 'hours');
    obj._start.subtract(minutes, 'minutes');
    obj._stop = moment();
    return regex;
  }
}

module.exports = function (obj) {
  obj._start = null;
  obj._stop = null;

  var matchedRegex = parseStartStop(obj) ||
    parseStopOnly(obj) ||
    parseStartOnly(obj) ||
    parseDuration(obj);

  var timeslice = {};
  if (obj._start !== null) {
    timeslice.startedAt = moment(obj._start).format('YYYY-MM-DD HH:mm');
  }
  if (obj._stop !== null) {
    timeslice.stoppedAt = moment(obj._stop).format('YYYY-MM-DD HH:mm');
  }

  if (!isEmpty(timeslice)) {
    obj.timeslices = [ timeslice ];
  }

  // cut off parsed time
  delete obj._start;
  delete obj._stop;
  obj._text = obj._text.replace(matchedRegex, '');
  return obj;
};
