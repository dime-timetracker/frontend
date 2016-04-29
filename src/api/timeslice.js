'use strict'

const api = require('../api')

function persist (timeslice, options) {
  return api.persist('timeslices', timeslice, options)
}

function fetchAll (options) {
  return api.fetchBunch('timeslices', Object.assign(options, { with: -1 }))
}

function remove (timeslice) {
  return api.remove('timeslices', timeslice.id)
}

module.exports = { fetchAll, persist, remove }
