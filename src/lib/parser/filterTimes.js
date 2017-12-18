'use strict'

var moment = require('moment')

module.exports = function (obj) {
  const filter = {}
  const patterns = [
    {
      regexp: /\btoday\b/,
      start: () => moment().startOf('day'),
      stop: () => null
    }, {
      regexp: /\byesterday\b/,
      start: () => moment().subtract(1, 'day').startOf('day'),
      stop: () => moment().subtract(1, 'day').endOf('day')
    }, {
      regexp: /\bcurrent week\b/,
      start: () => moment().startOf('week'),
      stop: () => null
    }, {
      regexp: /\blast week\b/,
      start: () => moment().subtract(1, 'week').startOf('week'),
      stop: () => moment().subtract(1, 'week').endOf('week')
    }, {
      regexp: /\blast ([0-9]+) weeks\b/,
      start: (matches) => moment().subtract(matches[1], 'weeks').startOf('day'),
      stop: () => null
    }, {
      regexp: /\bcurrent month\b/,
      start: () => moment().startOf('month'),
      stop: () => null
    }, {
      regexp: /\blast month\b/,
      start: () => moment().subtract(1, 'month').startOf('month'),
      stop: () => moment().subtract(1, 'month').endOf('month')
    }, {
      regexp: /\blast ([0-9]+) months\b/,
      start: (matches) => moment().subtract(matches[1], 'month').startOf('month'),
      stop: () => moment().subtract(1, 'month').endOf('month')
    }, {
      regexp: /\b([0-9]+) months ago\b/,
      start: (matches) => moment().subtract(matches[1], 'month').startOf('month'),
      stop: (matches) => moment().subtract(matches[1], 'month').endOf('month')
    }
  ]
  patterns.forEach(function (pattern) {
    const matches = obj._text.match(pattern.regexp)
    if (matches !== null) {
      filter.start = pattern.start(matches)
      filter.stop = pattern.stop(matches)
      obj._text = obj._text.replace(pattern.regexp, '', 'g')
    }
  })
  if (filter.start) {
    obj.filterStart = filter.start
  }
  if (filter.stop) {
    obj.filterStop = filter.stop
  }
  return obj
}
