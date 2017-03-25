'use strict'

const groupBy = require('lodash/groupBy')
const m = require('src/lib/mithril')
const sortBy = require('lodash/sortBy')

const addButton = require('./addButton')
const api = require('../../api/service')
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

  scope.add = (newService) => {
    api.persist(newService).then((service) => {
      scope.collection.unshift(service)
      m.redraw()
    })
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
          collection: scope.collection,
          enabled: status === 'enabled',
          key: 'service-' + service.id,
          service: service
        })
      })) : m('p', t('service.list.' + status + '.empty'))
    ])),
    m.component(addButton, { add: scope.add })
  ])
}

module.exports = { controller, view }
