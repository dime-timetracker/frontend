'use strict'

const api = require('../api')
const debug = require('debug')('api.activities')

const options = {}

function persist (activity, options) {
  return api.persist('activities', activity, options)
}

function fetchBunch (fetchOptions = {}) {
  return api.fetchBunch('activities', fetchOptions).then((bunch) => {
    options.pagination = fetchOptions.pagination
    debug(options)
    return bunch
  })
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

module.exports = { fetchBunch, fetchNext, persist, total }
