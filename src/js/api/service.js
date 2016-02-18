'use strict'

const api = require('../api')

const options = {}

let collection

function fetchAll () {
  return api.fetchBunch('service', { with: 100000 }).then((services) => {
    collection = services
  })
}

function fetchBunch () {
  return api.fetchBunch('service', options)
}

function total () {
  if (!options.pagination) {
    fetchBunch()
  }
  return options.total
}

module.exports = {
  collection: collection,
  fetchAll: fetchAll,
  fetchBunch: fetchBunch,
  total: total
}
