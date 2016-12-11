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

function setEndTime (timeslice, time) {
  const date = moment(timeslice.stopped_at).format('YYYY-MM-DD')
  setEnd(timeslice, date + 'T' + time)
}

function setEndDate (timeslice, date) {
  const time = moment(timeslice.stopped_at).format('HH:mm:ss')
  setEnd(timeslice, date + 'T' + time)
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

function startedAt (timeslice, precision) {
  const started = moment(timeslice.started_at)
  const precisionOffset = started.unix() % precision
  console.log(precisionOffset)
  started.subtract(precisionOffset, 'seconds')
  if (precisionOffset > precision / 2) {
    started.add(precision, 'seconds')
  }
  return started
}

function stoppedAt (timeslice, precision) {
  return startedAt(timeslice, precision)
    .add(duration(timeslice, precision), 'seconds')
}

module.exports = {
  now: now,
  getEnd: getEnd,
  getStart: getStart,
  setEnd: setEnd,
  setEndDate: setEndDate,
  setEndTime: setEndTime,
  setStart: setStart,
  setStartDate: setStartDate,
  setStartTime: setStartTime,
  startedAt: startedAt,
  stoppedAt: stoppedAt,
  duration: duration,
  running: (t) => { return !t.stopped_at }
}
