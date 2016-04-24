'use strict'

const m = require('src/lib/mithril')
const api = require('../api')

let collection = m.prop([])

function fetchAll () {
  return api.fetchBunch('projects', { with: 100000 }).then(collection)
}

function persist (project, options) {
  return api.persist('projects', project, options)
}

function remove (project) {
  return api.remove('projects', project.id)
}

function getCollection () {
  return new Promise(function (resolve, reject) {
    collection().length ? resolve(collection()) : fetchAll().then(resolve)
  })
}

module.exports = { fetchAll, getCollection, persist, remove }
