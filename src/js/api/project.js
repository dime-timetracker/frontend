'use strict'

const api = require('../api')

const options = {}

function fetchBunch () {
  return api.fetchBunch('project', options)
}

function total () {
  if (!options.pagination) {
    fetchBunch()
  }
  return options.total
}

module.exports = {
  fetchBunch: fetchBunch,
  total: total
}
