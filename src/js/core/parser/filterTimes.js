'use strict';

var moment = require('moment');

module.exports = function (obj) {
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
};
