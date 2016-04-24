'use strict'

const groupBy = require('lodash/collection/groupBy')
const m = require('src/lib/mithril')
const sortBy = require('lodash/collection/sortBy')

const api = require('../../api/customer')
const button = require('../utils/views/button')
const item = require('./item')
const t = require('../../lib/translation')

function controller () {
  const scope = {
    collection: []
  }
  api.getCollection().then((customers) => {
    scope.collection = sortBy(customers, (customer) => customer.name)
    m.redraw()
  })

  scope.add = (e) => {
    if (e) {
      e.preventDefault()
    }
    const newCustomer = { enabled: true }
    api.persist(newCustomer).then((customer) => {
      scope.collection.unshift(customer)
      m.redraw()
    })
  }

  return scope
};

function view (scope) {
  const customers = groupBy(scope.collection, (customer) => {
    return customer.enabled ? 'enabled' : 'disabled'
  })
  return m('.customers', [
    m('h2', t('customers')),
    ['enabled', 'disabled'].map((status) => m('.' + status, [
      m('h3.content-sub-heading', t('customer.list.' + status + '.headline')),
      (customers[status] && customers[status].length) ? m('.row', customers[status].map((customer) => {
        return m.component(item, {
          key: 'customer-' + customer.id,
          customer: customer,
          collection: scope.collection
        })
      })) : m('p', t('customer.list.' + status + '.empty'))
    ])),
    button('customer.add', '/customer', scope.add)
  ])
}

module.exports = { controller, view }
