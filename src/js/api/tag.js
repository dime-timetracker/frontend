'use strict'

const api = require('../api')

const options = {}

let collection

function fetchBunch () {
  return api.fetchBunch('tags', { with: 100000 }).then((tags) => {
    collection = tags
  })
}

function persist (tag, options) {
  return api.persist('tags', tag, options).then((tag) => {
    collection.push(tag)
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
  fetchBunch: fetchBunch,
  persist: persist,
  total: total
}
