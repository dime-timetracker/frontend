'use strict'

const groupBy = require('lodash/collection/groupBy')
const m = require('mithril')
const sortBy = require('lodash/collection/sortBy')

const api = require('../../api/service')
const button = require('../utils/views/button')
const item = require('./item')
const t = require('../../lib/translation')

function controller () {
  const scope = {
    collection: []
  }
  api.getCollection().then((services) => {
    scope.collection = sortBy(services, (service) => service.name)
    m.redraw()
  })

  scope.add = (e) => {
    if (e) {
      e.preventDefault()
    }
    const service = { enabled: true }
    scope.collection.push(service)
    api.persist(service)
    m.redraw()
  }

  return scope
};

function view (scope) {
  const services = groupBy(scope.collection, (service) => {
    return service.enabled ? 'enabled' : 'disabled'
  })
  return m('.services', [
    m('h2', t('services')),
    ['enabled', 'disabled'].map((status) => m('.' + status, [
      m('h3.content-sub-heading', t('service.list.' + status + '.headline')),
      (services[status] && services[status].length) ? m('.row', services[status].map((service) => {
        return m.component(item, {
          key: 'service-' + service.id,
          service: service,
          collection: scope.collection
        })
      })) : m('p', t('service.list.' + status + '.empty'))
    ])),
    button('service.add', '/service', scope.add)
  ])
}

module.exports = { controller, view }
