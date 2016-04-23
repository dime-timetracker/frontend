'use strict'

const m = require('mithril')
const t = require('../../lib/translation')
const api = require('../../api/customer')
const fieldViews = {
  input: require('../utils/views/formfields/input'),
  select: require('../utils/views/formfields/select'),
  boolean: require('../utils/views/formfields/selectBoolean')
}

function controller (context) {
  const scope = {
    customer: context.customer
  }

  scope.update = function (customer, e) {
    if (e) {
      e.preventDefault()
    }
    api.persist(customer)
  }

  return scope
}

function view (scope) {
  return m('.customer.' + scope.customer.alias, [
    m('p.row.form-group', [
      m('.col-md-3', t('customer.property.name')),
      m('.col-md-9', fieldViews.input({ name: 'name', change: (name) => {
        scope.customer.name = name
        scope.update(scope.customer)
      }}, scope.customer.name))
    ]),
    m('p.row.form-group', [
      m('.col-md-3', t('customer.property.alias')),
      m('.col-md-9', fieldViews.input({ name: 'alias', change: (alias) => {
        scope.customer.alias = alias
        scope.update(scope.customer)
      }}, scope.customer.alias))
    ]),
    m('p.row.form-group', [
      m('.col-md-3', t('customer.property.enabled')),
      m('.col-md-9', fieldViews.boolean({ name: 'alias', change: (enabled) => {
        scope.customer.enabled = (enabled === '1')
        scope.update(scope.customer)
      }}, scope.customer.enabled))
    ])
  ])
}

module.exports = {
  controller: controller,
  view: view
}