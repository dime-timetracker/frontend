'use strict'

const m = require('src/lib/mithril')
const api = require('../api')

let collection = m.prop([])

function fetchAll () {
  return api.fetchBunch('customers', { with: 100000 }).then(collection)
}

function persist (tag, options) {
  return api.persist('tags', tag, options)
}

function remove (customer) {
  return api.remove('customers', customer.id)
}

function getCollection () {
  return new Promise(function (resolve, reject) {
    collection().length ? resolve(collection()) : fetchAll().then(resolve)
  })
}

module.exports = { fetchAll, getCollection, persist, remove }
