'use strict'

const api = require('../api')

const options = {}

function fetchAll () {
  return api.fetchBunch('services', { with: 100000 })
}

function fetchBunch () {
  return api.fetchBunch('services', options)
}

function persist (service, options) {
  return api.persist('services', service, options)
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
