'use strict'

const settingsApi = require('../../../../api/setting')
const find = require('lodash/collection/find')
const isEqual = require('lodash/lang/isEqual')

const configPath = 'filter/bookmarks'

let bookmarks = settingsApi.find(configPath) || []

function getQueryParts (query) {
  return query && query.replace(/\s+/, ' ').trim().split(' ').sort()
}

function isKnownQuery (query) {
  return (undefined !== find(bookmarks, function (candidate) {
    return isEqual(getQueryParts(candidate.query), getQueryParts(query))
  }))
}

function add (name, query) {
  bookmarks.push({name: name, query: query})
  settingsApi.persistConfig(configPath, bookmarks)
}

function update (oldName, newName, newQuery) {
  bookmarks.find((bookmark, index, bookmarks) => {
    bookmarks[index] = {name: newName, query: newQuery}
    settingsApi.persistConfig(configPath, bookmarks)
    return true
  })
}

function remove (name) {
  bookmarks.find((bookmark, index, bookmarks) => {
    if (bookmark.name === name) {
      delete bookmarks[index]
      settingsApi.persistConfig(configPath, bookmarks)
      return true
    }
  })
}

module.exports = {
  injectList: function (list) { bookmarks = list }, // for testing purposes
  add: add,
  remove: remove,
  update: update,
  list: bookmarks,
  isKnownQuery: isKnownQuery
}
