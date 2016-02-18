'use strict'

const api = require('../api')

const options = {}

let collection

function fetchAll () {
  return api.fetchBunch('customer', { with: 100000 }).then((customers) => {
    collection = customers
  })
}

function fetchBunch () {
  return api.fetchBunch('customer', options)
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
