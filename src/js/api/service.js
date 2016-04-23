'use strict'

const m = require('mithril')
const api = require('../api')

let collection = m.prop([])

function fetchAll () {
  return api.fetchBunch('services', { with: 100000 })
}

function persist (service, options) {
  return api.persist('services', service, options)
}

function remove (service) {
  return api.remove('services', service.id)
}

function getCollection () {
  return new Promise(function (resolve, reject) {
    collection().length ? resolve(collection()) : fetchAll().then(resolve)
  })
}

module.exports = { fetchAll, getCollection, persist, remove }
