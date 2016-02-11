'use strict'

var isNull = require('lodash/lang/isNull')
var isNumber = require('lodash/lang/isNumber')
var isUndefined = require('lodash/lang/isUndefined')
var moment = require('moment')

function getEnd (timeslice) {
  return timeslice.stoppedAt ? moment(timeslice.stoppedAt) : moment()
}

function getStart (timeslice) {
  return moment(timeslice.startedAt)
}

function duration (timeslice, precision) {
  let result = 0

  if (isNull(timeslice.duration) || timeslice.duration === 0) {
    result = getEnd(timeslice).diff(getStart(timeslice), 'seconds')
  } else {
    result = parseInt(timeslice.duration)
  }

  if (!isUndefined(precision)) {
    precision = parseInt(precision)
    if (isNumber(precision) && precision > 0) {
      result = Math.ceil(result / precision) * precision
    }
  }

  return result
}

module.exports = {
  getStart: getStart,
  getEnd: getEnd,
  duration: duration,
  running: (t) => { return !t.stoppedAt }
}
