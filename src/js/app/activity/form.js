'use strict'

const m = require('mithril')
const t = require('../../lib/translation')
const inputView = require('../utils/views/formfields/input')
const selectView = require('../utils/views/formfields/select')

function controller (context) {
  return {
    activity: context.activity,
    customers: context.customers.map((customer) => { return { key: customer.id, value: customer.name } }),
    projects: context.projects,
    services: context.services
  }
}

function view (scope) {
  function id (field) {
    return 'activity-' + field + '-' + scope.activity.id
  }
  return m('.table-responsive', m('table', [
    m('tr', [
      m('td', m('.label', {
        'for': id('description')
      }, t('activity.description'))),
      m('td', inputView({ id: id('description') }, scope.activity.description))
    ]),
    m('tr', [
      m('td', m('.label', {
        'for': id('customer')
      }, t('activity.customer'))),
      m('td', selectView({ id: id('customer'), options: scope.customers }, scope.activity.customer))
    ])
  ]))
}

module.exports = {
  controller: controller,
  view: view
}
