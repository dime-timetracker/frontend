'use strict';

var configuration = require('../../../lib/configuration');
var find = require('lodash/collection/find');
var isEqual = require('lodash/lang/isEqual');

var configPath = 'filter/bookmarks';
var bookmarks;

function getList () {
  return bookmarks || JSON.parse(configuration.get(configPath, '[]'));
}

function getQueryParts (query) {
  return query && query.replace(/\s+/, ' ').trim().split(' ').sort();
}

function isKnownQuery (query) {
  return (undefined !== find(getList(), function (candidate) {
    return isEqual(getQueryParts(candidate.query), getQueryParts(query));
  }));
}

function persist (bookmarks) {
  configuration.set(configPath, JSON.stringify(bookmarks));
}

function add (name, query) {
  var bookmarks = getList();
  bookmarks.push({name: name, query: query});
  persist(bookmarks);
}

function update (oldName, newName, newQuery) {
  find(getList(), function (bookmark, index, bookmarks) {
    if (bookmark.name === oldName) {
      bookmarks[index] = {name: newName, query: newQuery};
      persist(bookmarks);
      return true;
    }
  });
}

function remove (name) {
  find(getList(), function (bookmark, index, bookmarks) {
    if (bookmark.name === name) {
      delete bookmarks[index];
      persist(bookmarks);
      return true;
    }
  });
}

module.exports = {
  injectList: function (list) { bookmarks = list }, // for testing purposes
  add: add,
  remove: remove,
  update: update,
  getList: getList,
  isKnownQuery: isKnownQuery
};