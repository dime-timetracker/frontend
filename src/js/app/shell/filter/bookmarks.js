'use strict'

const settingsApi = require('../../../api/setting')
const find = require('lodash/collection/find')
const isEqual = require('lodash/lang/isEqual')

const configPath = 'filter/bookmarks'

function getList () {
  return settingsApi.find(configPath)
}

function getQueryParts (query) {
  return query && query.replace(/\s+/, ' ').trim().split(' ').sort()
}

function isKnownQuery (query) {
  return (undefined !== find(settingsApi.collection || [], function (candidate) {
    return isEqual(getQueryParts(candidate.query), getQueryParts(query))
  }))
}

function add (name, query) {
  getList().then((bookmarks) => {
    bookmarks.push({name: name, query: query})
    settingsApi.persist(bookmarks)
  })
}

function update (oldName, newName, newQuery) {
  getList().then((bookmarks) => {
    bookmarks.find((bookmark, index, bookmarks) => {
      bookmarks[index] = {name: newName, query: newQuery}
      settingsApi.persist(bookmarks)
      return true
    })
  })
}

function remove (name) {
  getList().then((bookmarks) => {
    bookmarks.find((bookmark, index, bookmarks) => {
      if (bookmark.name === name) {
        delete bookmarks[index]
        settingsApi.persist(bookmarks)
        return true
      }
    })
  })
}

module.exports = {
  injectList: function (list) { bookmarks = list }, // for testing purposes
  add: add,
  remove: remove,
  update: update,
  getList: getList,
  isKnownQuery: isKnownQuery
};
