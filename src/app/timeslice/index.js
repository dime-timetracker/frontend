'use strict'

const m = require('src/lib/mithril')
const isNumber = require('lodash/isNumber')
const isUndefined = require('lodash/isUndefined')
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

function updateDuration (timeslice) {
  if (timeslice.started_at && timeslice.stopped_at) {
    timeslice.duration = null
    timeslice.duration = duration(timeslice)
  }
}

function getEnd (timeslice) {
  return timeslice.stopped_at ? moment(timeslice.stopped_at, timestampFormat) : now()
}

function setEnd (timeslice, value) {
  timeslice.stopped_at = moment(value).format(timestampFormat)
  updateDuration(timeslice)
}

function getStart (timeslice) {
  return moment(timeslice.started_at, timestampFormat)
}

function setStart (timeslice, value) {
  timeslice.started_at = moment(value).format(timestampFormat)
  updateDuration(timeslice)
}

function setStartTime (timeslice, time) {
  const date = moment(timeslice.started_at).format('YYYY-MM-DD')
  setStart(timeslice, date + 'T' + time)
}

function setStartDate (timeslice, date) {
  const time = moment(timeslice.started_at).format('HH:mm:ss')
  setStart(timeslice, date + 'T' + time)
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
  getEnd: getEnd,
  getStart: getStart,
  setEnd: setEnd,
  setStart: setStart,
  setStartDate: setStartDate,
  setStartTime: setStartTime,
  duration: duration,
  running: (t) => { return !t.stopped_at }
}
