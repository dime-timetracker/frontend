'use strict'

const api = require('../api')
const debug = require('debug')('api.activities')

const options = {}

function persist (activity, options) {
  return api.persist('activities', activity, options)
}

function fetchBunch () {
  debug('fetching activities')
  let result = api.fetchBunch('activities', options)
  debug(result)
  return result
}

function total () {
  if (!options.pagination) {
    debug('request activities to get total')
    fetchBunch()
  }
  return options.total
}

module.exports = {
  fetchBunch: fetchBunch,
  persist: persist,
  total: total
}
