'use strict'

const m = require('src/lib/mithril')
const api = require('../api')

let collection = m.prop([])

function fetchAll () {
  return api.fetchBunch('tags', { with: 100000 }).then(collection)
}

function persist (tag, options) {
  return api.persist('tags', tag, options)
}

function remove (tag) {
  return api.remove('tags', tag.id)
}

function getCollection () {
  return new Promise(function (resolve, reject) {
    collection().length ? resolve(collection()) : fetchAll().then(resolve)
  })
}

module.exports = { fetchAll, getCollection, persist, remove }
