'use strict'

const api = require('../api')

const options = {}

function fetchAll () {
  return api.fetchBunch('projects', { with: 100000 })
}

function fetchBunch () {
  return api.fetchBunch('projects', options)
}

function persist (project, options) {
  return api.persist('projects', project, options)
}

function total () {
  if (!options.pagination) {
    fetchBunch()
  }
  return options.total
}

module.exports = {
  fetchAll: fetchAll,
  fetchBunch: fetchBunch,
  persist: persist,
  total: total
}
