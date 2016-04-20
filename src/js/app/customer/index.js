'use strict'

const m = require('mithril')
const t = require('../../lib/translation')
const item = require('./item')
const button = require('../utils/views/button')
const api = require('../../api/customer')
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
  const enabledCustomers = filter(scope.collection, { enabled: true })
  const disabledCustomers = filter(scope.collection, { enabled: false })

  return m('div.list-customer', [
    m('h2', t('customers')),
    m('.enabled', [
      m('h3.content-sub-heading', t('customer.list.enabled.headline')),
      enabledCustomers.length > 0
      ? enabledCustomers.map((customer) => {
        return m.component(item, {
          key: 'customer-' + customer.uuid,
          customer: customer,
          collection: scope.collection
        })
      }) : m('p', t('customer.list.enabled.empty'))
    ]),
    m('.disabled', [
      m('h3.content-sub-heading', t('customer.list.disabled.headline')),
      disabledCustomers.length > 0
      ? disabledCustomers.map((customer) => {
        return m.component(item, {
          key: 'customer-' + customer.uuid,
          customer: customer,
          collection: scope.collection
        })
      }) : m('p', t('customer.list.disabled.empty'))
    ]),
    button('customer.add', '/customer', scope.add)
  ])
}

module.exports = {
  controller: controller,
  view: view
}
