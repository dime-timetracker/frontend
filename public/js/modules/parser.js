'use strict';

if ("undefined" == typeof(moment)) {
  var moment = require('../moment.js');
}

(function (moment) {
  var parser = {
    result: {},
    parse: function(string) {
      parser.result.string = string;
      [
        parser.parseCustomer,
        parser.parseProject,
        parser.parseService,
        parser.parseTimes,
        parser.parseDescription
      ].forEach(function(parser) {
        parser()
      });
      return parser.result;
    },
    parseCustomer: function() {
      var string = parser.result.string;
      parser.result.customer = {};
      var customer = string.match(/@([a-z]+)/);
      if (null == customer) {
        return;
      }
      parser.result.string = string.replace('@' + customer[1], '', 'g');
      parser.result.customer.alias = customer[1];
    },
    parseProject: function() {
      var string = parser.result.string;
      parser.result.project = {};
      var project = string.match(/\/([a-z]+)/);
      if (null == project) {
        return;
      }
      parser.result.string = string.replace('/' + project[1], '', 'g');
      parser.result.project.alias = project[1];
    },
    parseService: function() {
      var string = parser.result.string;
      parser.result.service = {};
      var service = string.match(/:([a-z]+)/);
      if (null == service) {
        return;
      }
      parser.result.string = string.replace(':' + service[1], '', 'g');
      parser.result.service.alias = service[1];
    },
    parseTimes: function() {
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
    },
    parseDescription: function() {
      parser.result.description = parser.result.string.trim().replace(/ +/, ' ');
      parser.result.string = null;
    }
  }
  module && (module.exports = parser);
  return parser;
})(moment)
