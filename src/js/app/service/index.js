'use strict'

const m = require('mithril')
const t = require('../../lib/translation')
const item = require('./item')
const button = require('../utils/views/button')
const api = require('../../api/service')
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

  list.push(m('h2', t('services')))

  list.push(m('h3.content-sub-heading', t('service.list.enabled.headline')))

  let collection = filter(scope.collection, { enabled: true })
  if (collection.length > 0) {
    collection.forEach((service) => {
      list.push(m.component(item, {
        key: 'service-' + service.uuid,
        service: service,
        collection: scope.collection
      }))
    })
  } else {
    list.push(m('p', t('service.list.enabled.empty')))
  }

  list.push(m('h3.content-sub-heading', t('service.list.disabled.headline')))
  collection = filter(scope.collection, { enabled: false })
  if (collection.length > 0) {
    collection.forEach((service) => {
      list.push(m.component(item, {
        key: scope.type + '-' + service.uuid,
        service: service,
        collection: scope.collection
      }))
    })
  } else {
    list.push(m('p', t('service.list.disabled.empty')))
  }

  list.push(button('service.add', '/service', scope.add))

  return m('div.list-service', list)
};

module.exports = {
  controller: controller,
  view: view
}
