;(function (dime, moment) {
  'use strict';

  dime.helper.parser = new dime.Parser();

  dime.helper.parser.register('customer', function parseCustomer (obj) {
    var customer = obj._text.match(/\B@([a-z0-9\-\/\_+]+)\b/i);
    if (null !== customer) {
      obj.customer = {
        alias: customer[1]
      };
      obj._text = obj._text.replace('@' + customer[1], '', 'g');
    }
    return obj;
  });

  dime.helper.parser.register('project', function parseProject(obj) {
    var project = obj._text.match(/\B\/([a-z0-9\-\/\_+]+)\b/i);
    if (null !== project) {
      obj.project = {
        alias: project[1]
      };
      obj._text = obj._text.replace('/' + project[1], '', 'g');
    }
    return obj;
  });

  dime.helper.parser.register('service', function parseService(obj) {
    var service = obj._text.match(/\B:([a-z0-9\-\/\_+]+)\b/i);
    if (null !== service) {
      obj.project = {
        alias: service[1]
      };
      obj._text = obj._text.replace(':' + service[1], '', 'g');
    }
    return obj;
  });

  dime.helper.parser.register('tags', function parseTags(obj) {
    var tags = obj._text.match(/\B#([a-z0-9\-\/\_+]+)\b/gi);
    if (null !== tags) {
      var tagNames = [];
      tags.forEach(function (tag) {
        tagNames.push({ name: tag.substr(1) });
        obj._text = obj._text.replace(tag, '', 'g');
      });
      obj.tags = tagNames;
    }
    return obj;
  });

  dime.helper.parser.register('times', function parseTimes(obj) {
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

    var timeslice = {};
    if (start !== null) {
      timeslice.startedAt = moment(start).format('YYYY-MM-DD HH:mm');
    }
    if (stop !== null) {
      timeslice.stoppedAt = moment(stop).format('YYYY-MM-DD HH:mm');
    }
    if (!_.isEmpty(timeslice)) {
      obj.timeslices = [ timeslice ];
    }

    // cut off parsed time
    obj._text = obj._text.replace(regex, '');
    return obj;
  });

  dime.helper.parser.register('filterTimes', function parseFilterTimes (obj) {
    [
      {
        'keyword': 'today',
        'start': moment().startOf('day')
      }, {
        'keyword': 'yesterday',
        'start': moment().subtract(1, 'day').startOf('day'),
        'stop': moment().subtract(1, 'day').endOf('day')
      }, {
        'keyword': 'current week',
        'start': moment().startOf('week')
      }, {
        'keyword': 'last week',
        'start': moment().subtract(1, 'week').startOf('week'),
        'stop': moment().subtract(1, 'week').endOf('week')
      }, {
        'keyword': 'last 4 weeks',
        'start': moment().subtract(4, 'weeks').startOf('day')
      }, {
        'keyword': 'current month',
        'start': moment().startOf('month')
      }, {
        'keyword': 'last month',
        'start': moment().subtract(1, 'month').startOf('month'),
        'stop': moment().subtract(1, 'month').endOf('month')
      }
    ].forEach(function (pattern) {
      var filter = {};
      var regex = new RegExp('\\b' + pattern.keyword + '\\b');
      if (obj._text.match(regex)) {
        filter.start = pattern.start;
        filter.stop = pattern.stop;
        obj._text = obj._text.replace(regex, '', 'g');
      }
    });
    return obj;
  });

  dime.helper.parser.register('description', function parseDescription(obj) {
    obj.description = obj._text.trim().replace(/ +/, ' ');
    return obj;
  });
  
})(dime, moment);
