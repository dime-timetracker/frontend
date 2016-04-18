'use strict'

const api = require('../api')

const options = {}

let collection

function fetchAll () {
  return api.fetchBunch('project', { with: 100000 }).then((projects) => {
    collection = projects
  })
}

function fetchBunch () {
  return api.fetchBunch('project', options)
}

function persist (project, options) {
  return api.persist('project', project, options).then((project) => {
    collection.push(project)
  })
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
