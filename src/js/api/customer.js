'use strict'

const api = require('../api')

const options = {}

function persist (customer, options) {
  return api.persist('customers', customer, options)
}

function fetchAll () {
  return api.fetchBunch('customers', { with: 100000 })
}

function fetchBunch () {
  return api.fetchBunch('customers', options)
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
