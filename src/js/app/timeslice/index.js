'use strict'

const m = require('mithril')
const isNumber = require('lodash/lang/isNumber')
const isUndefined = require('lodash/lang/isUndefined')
const moment = require('moment')
const userSettings = require('../setting').sections
const timestampFormat = userSettings.find('global.timestamp.format')

const currently = m.prop()

function now (time) {
  if (time) {
    currently(moment(time, timestampFormat))
  }
  return currently() || moment()
}

function getEnd (timeslice) {
  return timeslice.stopped_at ? moment(timeslice.stopped_at, timestampFormat) : now()
}

function getStart (timeslice) {
  return moment(timeslice.started_at, timestampFormat)
}

function duration (timeslice, precision) {
  let result = timeslice.duration
    ? parseInt(timeslice.duration)
    : getEnd(timeslice).diff(getStart(timeslice), 'seconds')

  if (!isUndefined(precision)) {
    precision = parseInt(precision)
    if (isNumber(precision) && precision > 0) {
      result = Math.ceil(result / precision) * precision
    }
  }

  return result
}

module.exports = {
  now: now,
  getStart: getStart,
  getEnd: getEnd,
  duration: duration,
  running: (t) => { return !t.stopped_at }
}
