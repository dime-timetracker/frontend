'use strict'

const addButton = require('./addButton')
const api = require('../../api/tag')
const filter = require('lodash/filter')
const item = require('./item')
const m = require('src/lib/mithril')
const sortBy = require('lodash/sortBy')
const t = require('../../lib/translation')

function controller () {
  var scope = {
    collection: []
  }
  api.getCollection().then((tags) => {
    scope.collection = sortBy(tags, (tag) => tag.name)
    m.redraw()
  })

  scope.add = (newTag) => {
    api.persist(newTag).then((tag) => {
      scope.collection.unshift(tag)
      m.redraw()
    })
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

  list.push(m.component(addButton, { add: scope.add }))

  return m('div.list-tag', list)
};

module.exports = {
  controller: controller,
  view: view
}
