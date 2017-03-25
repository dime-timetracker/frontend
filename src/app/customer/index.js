'use strict'

const groupBy = require('lodash/groupBy')
const m = require('src/lib/mithril')
const sortBy = require('lodash/sortBy')

const addButton = require('./addButton')
const api = require('../../api/customer')
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

  scope.add = (newCustomer) => {
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
          collection: scope.collection,
          customer: customer,
          enabled: status === 'enabled',
          key: 'customer-' + customer.id
        })
      })) : m('p', t('customer.list.' + status + '.empty'))
    ])),
    m.component(addButton, { add: scope.add })
  ])
}

module.exports = { controller, view }
