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

function persist (service, options) {
  return api.persist('service', service, options).then((service) => {
    collection.push(service)
  })
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
  persist: persist,
  total: total
}
