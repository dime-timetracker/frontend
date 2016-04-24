'use strict'

const api = require('../api')

const options = {}

function persist (timeslice, options) {
  return api.persist('timeslices', timeslice, options)
}

function fetchAll (options) {
  return api.fetchBunch('timeslices', Object.assign(options, { with: 1000000 }))
}

function fetchBunch () {
  return api.fetchBunch('timeslices', options)
}

function total () {
  if (!options.pagination) {
    fetchBunch()
  }
  return options.total
}

module.exports = {
  fetchAll: fetchAll,
  fetchBunch: fetchBunch,
  persist: persist,
  total: total
}
