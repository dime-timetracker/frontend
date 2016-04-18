'use strict'

const m = require('mithril')
const t = require('../../lib/translation')
const item = require('./item')
const button = require('../utils/views/button')
const api = require('../../api/project')
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

  list.push(m('h2', t('projects')))

  list.push(m('h3.content-sub-heading', t('project.list.enabled.headline')))

  let collection = filter(scope.collection, { enabled: true })
  if (collection.length > 0) {
    collection.forEach((project) => {
      list.push(m.component(item, {
        key: 'project-' + project.uuid,
        project: project,
        collection: scope.collection
      }))
    })
  } else {
    list.push(m('p', t('project.list.enabled.empty')))
  }

  list.push(m('h3.content-sub-heading', t('project.list.disabled.headline')))
  collection = filter(scope.collection, { enabled: false })
  if (collection.length > 0) {
    collection.forEach((project) => {
      list.push(m.component(item, {
        key: scope.type + '-' + project.uuid,
        project: project,
        collection: scope.collection
      }))
    })
  } else {
    list.push(m('p', t('project.list.disabled.empty')))
  }

  list.push(button('project.add', '/project', scope.add))

  return m('div.list-project', list)
};

module.exports = {
  controller: controller,
  view: view
}
