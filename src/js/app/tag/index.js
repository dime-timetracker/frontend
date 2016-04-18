'use strict'

const m = require('mithril')
const t = require('../../lib/translation')
const item = require('./item')
const button = require('../utils/views/button')
const api = require('../../api/tag')
const filter = require('lodash/collection/filter')

function controller () {
  var scope = {
    collection: []
  }
  api.fetchBunch().then((collection) => {
    scope.collection = collection
  })

  scope.add = (e) => {
    if (e) {
      e.preventDefault()
    }
    api.persist({})
  }

  return scope
};

function view (scope) {
  var list = []

  list.push(m('h2', t('tags')))

  list.push(m('h3.content-sub-heading', t('tag.list.enabled.headline')))

  let collection = filter(scope.collection, { enabled: true })
  if (collection.length > 0) {
    collection.forEach((tag) => {
      list.push(m.component(item, {
        key: 'tag-' + tag.uuid,
        tag: tag,
        collection: scope.collection
      }))
    })
  } else {
    list.push(m('p', t('tag.list.enabled.empty')))
  }

  list.push(m('h3.content-sub-heading', t('tag.list.disabled.headline')))
  collection = filter(scope.collection, { enabled: false })
  if (collection.length > 0) {
    collection.forEach((tag) => {
      list.push(m.component(item, {
        key: scope.type + '-' + tag.uuid,
        tag: tag,
        collection: scope.collection
      }))
    })
  } else {
    list.push(m('p', t('tag.list.disabled.empty')))
  }

  list.push(button('tag.add', '/tag', scope.add))

  return m('div.list-tag', list)
};

module.exports = {
  controller: controller,
  view: view
}
