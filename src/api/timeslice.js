'use strict'

const api = require('../api')
const moment = require('moment')

function create (activityId, timestampFormat) {
  timestampFormat = timestampFormat || 'YYYY-MM-DD HH:mm:ss'
  return {
    activity_id: parseInt(activityId, 10),
    duration: 0,
    started_at: moment().format(timestampFormat)
  }
}

function persist (timeslice, options) {
  return api.persist('timeslices', timeslice, options)
}

function fetchAll (options) {
  return api.fetchBunch('timeslices', Object.assign(options, { with: -1 }))
}

function remove (timeslice) {
  return api.remove('timeslices', timeslice.id)
}

module.exports = { create, fetchAll, persist, remove }
