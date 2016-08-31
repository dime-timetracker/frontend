'use strict'

const debug = require('debug')('app.activity.shell.filter.bookmarks')
const find = require('lodash/collection/find')
const isEqual = require('lodash/lang/isEqual')
const settingsApi = require('src/api/setting')

const configPath = 'filter/bookmarks'

let bookmarks = []

function getQueryParts (query) {
  return query && query.replace(/\s+/, ' ').trim().split(' ').sort()
}

function isKnownQuery (query) {
  return bookmarks.some(bookmark => isEqual(getQueryParts(bookmark.query), getQueryParts(query)))
}

function add (name, query) {
  bookmarks.push({name: name, query: query})
  settingsApi.persistConfig(configPath, JSON.stringify(bookmarks))
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

function init (list) {
  if (list) {
    bookmarks = list
  } else {
    list = settingsApi.find(configPath)
    if (list) {
      bookmarks = JSON.parse(list)
    } else {
      bookmarks = []
    }
  }
  debug('bookmarks', bookmarks)
  return bookmarks
}

module.exports = { init, add, remove, update, list: () => bookmarks, isKnownQuery }
