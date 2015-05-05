'use strict';

if ("undefined" == typeof(dime)) {
  var dime = {};
}
if ("undefined" == typeof(moment)) {
  var moment = require('../vendor/moment.js');
}

(function (dime, moment) {
  var parser = {
    result: {}
  };
  parser.parse = function (string) {
    parser.result.string = string;
    [
      parser.parseCustomer,
      parser.parseProject,
      parser.parseService,
      parser.parseTags,
      parser.parseTimes,
      parser.parseDescription
    ].forEach(function(parser) {
      parser()
    });
    return parser.result;
  };

  parser.parseFilter = function (string) {
    parser.parse(string);
    if (null === parser.result.startedAt && null === parser.result.stoppedAt) {
      parser.parseFilterTimes();
    }
    return parser.result;
  };

  parser.parseFilterTimes = function () {
    var string = parser.result.description;
    [
      {
        'keyword': 'today',
        'start': moment().hour(0).minute(0).second(0),
        'stop': moment().hour(23).minute(59).second(59)
      }, {
        'keyword': 'yesterday',
        'start': moment().subtract(1, 'day').hour(0).minute(0).second(0),
        'stop': moment().subtract(1, 'day').hour(23).minute(59).second(59)
      }, {
        'keyword': 'last month',
        'start': moment().date(1).subtract(1, 'month').hour(0).minute(0).second(0),
        'stop': moment().date(0).hour(23).minute(59).second(59)
      }, {
        'keyword': 'current month',
        'start': moment().date(0).hour(0).minute(0).second(0)
      }
    ].forEach(function (pattern) {
      var regex = new RegExp('\\b' + pattern.keyword + '\\b');
      if (string.match(regex)) {
        parser.result.startedAt = pattern.start;
        parser.result.stoppedAt = pattern.stop;
        parser.result.description = parser.result.description.replace(regex, '', 'g');
        parser.result.description = parser.result.description.replace(/ +/, ' ', 'g');
      }
    });
  };

  parser.parseCustomer = function () {
    var string = parser.result.string;
    parser.result.customer = {};
    var customer = string.match(/\B@([a-z0-9\-\/\_+]+)\b/i);
    if (null == customer) {
      return;
    }
    parser.result.string = string.replace('@' + customer[1], '', 'g');
    parser.result.customer.alias = customer[1];
  };

  parser.parseProject = function () {
    var string = parser.result.string;
    parser.result.project = {};
    var project = string.match(/\B\/([a-z0-9\-\/\_+]+)\b/i);
    if (null == project) {
      return;
    }
    parser.result.string = string.replace('/' + project[1], '', 'g');
    parser.result.project.alias = project[1];
  };

  parser.parseService = function () {
    var string = parser.result.string;
    parser.result.service = {};
    var service = string.match(/\B:([a-z0-9\-\/\_+]+)\b/i);
    if (null == service) {
      return;
    }
    parser.result.string = string.replace(':' + service[1], '', 'g');
    parser.result.service.alias = service[1];
  };

  parser.parseTags = function () {
    var string = parser.result.string;
    parser.result.tags = [];
    var tags = string.match(/\B#([a-z0-9\-\/\_+]+)\b/gi);
    if (null == tags) {
      return;
    }
    var tagNames = [];
    tags.forEach(function (tag) {
      tagNames.push(tag.substr(1));
      string = string.replace(tag, '', 'g');
    });
    parser.result.string = string;
    parser.result.tags = tagNames;
  };

  parser.parseTimes = function () {
    var string = parser.result.string;
    parser.result.startedAt = null;
    parser.result.stoppedAt = null;
    var start = null;
    var stop = null;

    // 01:23-03:49 (start and stop given)
    var regex = /(\d+:\d{2})-(\d+:\d{2})/;
    var matches = string.match(regex);
    if (null != matches) {
      start = moment(moment().format('YYYY-MM-DD ') + matches[1]);
      stop  = moment(moment().format('YYYY-MM-DD ') + matches[2]);
      while (stop.isBefore(start)) {
        start = start.subtract(1, 'day');
      }
    } else {
      // -01:23 (only stop time given, starting now)
      regex = /(-(\d+):(\d{2})h?)/;
      matches = string.match(regex);
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
        matches = string.match(regex);
        if (null != matches) {
          stop = moment()
          start = moment().hours(matches[3])
            .minutes(matches[4]);
          while (stop.isBefore(start)) {
            start = start.subtract(1, 'day');
          }
        } else {
          // 01:23 (duration given, stopping now)
          var hours = 0;
          var minutes = 0;
          regex = /((\d+):(\d{2})h?)/;
          matches = string.match(regex);
          if (null != matches) {
              hours = matches[2];
              minutes = matches[3];
          } else {
            regex = /(^| )((\d+)h( ?(\d+)m)?)/;
            matches = string.match(regex);
            if (null != matches) {
              hours = matches[3];
              minutes = matches[5];
            } else {
              regex = /(^| )(\d+)([\.,](\d+))?h/;
              matches = string.match(regex);
              if (null == matches) {
                return;
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
    parser.result.startedAt = moment(start).format('YYYY-MM-DD HH:mm');
    parser.result.stoppedAt = moment(stop).format('YYYY-MM-DD HH:mm');

    // cut off parsed time
    parser.result.string = parser.result.string.replace(regex, '');
  };

  parser.parseDescription = function () {
    parser.result.description = parser.result.string.trim().replace(/ +/, ' ');
    parser.result.string = null;
  };

  "undefined" != typeof(module) && (module.exports = parser);
  dime.parser = parser;
  return parser;
})(dime, moment)
