'use strict'

const api = require('../api')
const debug = require('debug')('api.activities')
const m = require('src/lib/mithril')

let collection = m.prop([])

const options = {}

function persist (activity, options) {
  return api.persist('activities', activity, options)
}

function fetchBunch (fetchOptions = {}) {
  return api.fetchBunch('activities', fetchOptions).then((bunch) => {
    options.pagination = fetchOptions.pagination
    collection([...collection(), bunch])
    debug(options)
    return bunch
  })
}

function fetchAll (fetchOptions = {}) {
  fetchOptions.with = -1
  return fetchBunch(fetchOptions)
}

function fetchNext (fetchOptions = {}) {
  fetchOptions.url = options.pagination.next
  return fetchBunch(fetchOptions)
}

function total () {
  if (!options.pagination) {
    debug('Please request activities before to get total')
  }
  return options.pagination.total
}

function getCollection () {
  return new Promise(function (resolve, reject) {
    collection().length ? resolve(collection()) : fetchBunch().then(resolve)
  })
}

module.exports = { fetchAll, fetchBunch, fetchNext, getCollection, persist, total }
