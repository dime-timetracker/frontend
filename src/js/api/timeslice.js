'use strict'

const api = require('../api')

const options = {}

function persist (timeslice, options) {
  return api.persist('timeslice', timeslice, options)
}

function fetchBunch () {
  return api.fetchBunch('timeslice', options)
}

function total () {
  if (!options.pagination) {
    fetchBunch()
  }
  return options.total
}

module.exports = {
  fetchBunch: fetchBunch,
  persist: persist,
  total: total
}
