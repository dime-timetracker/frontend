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
  var list = []

  list.push(m('h2', t('customers')))

  list.push(m('h3.content-sub-heading', t('customer.list.enabled.headline')))

  let collection = filter(scope.collection, { enabled: true })
  if (collection.length > 0) {
    collection.forEach((customer) => {
      list.push(m.component(item, {
        key: 'customer-' + customer.uuid,
        customer: customer,
        collection: scope.collection
      }))
    })
  } else {
    list.push(m('p', t('customer.list.enabled.empty')))
  }

  list.push(m('h3.content-sub-heading', t('customer.list.disabled.headline')))
  collection = filter(scope.collection, { enabled: false })
  if (collection.length > 0) {
    collection.forEach((customer) => {
      list.push(m.component(item, {
        key: scope.type + '-' + customer.uuid,
        customer: customer,
        collection: scope.collection
      }))
    })
  } else {
    list.push(m('p', t('customer.list.disabled.empty')))
  }

  list.push(button('customer.add', '/customer', scope.add))

  return m('div.list-customer', list)
};

module.exports = {
  controller: controller,
  view: view
}
