'use strict'

const api = require('../api')

const options = {}

function fetchAll () {
  return api.fetchBunch('setting', { with: 100000 })
}

function total () {
  if (!options.pagination) {
    fetchAll()
  }
  return options.total
}

module.exports = {
  fetchAll: fetchAll,
  total: total
}
