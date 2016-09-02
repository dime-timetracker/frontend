'use strict'

const m = require('src/lib/mithril')
const api = require('../api')
const arrayRemove = require('lodash/remove')

let collection = m.prop([])

function fetchAll () {
  return api.fetchBunch('customers', { with: 100000 }).then(collection)
}

function persist (customer, options) {
  return api.persist('customers', customer, options)
}

function remove (customer) {
  return api.remove('customers', customer.id).then(() => {
    arrayRemove(collection, function (item) {
      return item.id === customer.id
    })
  })
}

function getCollection () {
  return new Promise(function (resolve, reject) {
    collection().length ? resolve(collection()) : fetchAll().then(resolve)
  })
}

module.exports = { fetchAll, getCollection, persist, remove }
