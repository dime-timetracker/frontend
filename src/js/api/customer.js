'use strict'

const api = require('../api')

const options = {}

let collection = []

function persist (customer, options) {
  return api.persist('customers', customer, options).then((customer) => {
    collection.push(customer)
  })
}

function fetchAll () {
  return api.fetchBunch('customers', { with: 100000 }).then((customers) => {
    collection = customers
  })
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
  collection: collection,
  fetchAll: fetchAll,
  fetchBunch: fetchBunch,
  persist: persist,
  total: total
}
