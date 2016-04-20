'use strict'

const m = require('mithril')
const t = require('../../lib/translation')
const inputView = require('../utils/views/formfields/input')
const selectView = require('../utils/views/formfields/select')

function controller (context) {
  return {
    activity: context.activity,
    customers: context.customers.map((customer) => { return { value: customer.id, label: customer.name } }),
    projects: context.projects.map((project) => { return { value: project.id, label: project.name } }),
    services: context.services.map((service) => { return { value: service.id, label: service.name } })
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
    ]),
    m('tr', [
      m('td', m('.label', {
        'for': id('project')
      }, t('activity.project'))),
      m('td', selectView({ id: id('project'), options: scope.projects }, scope.activity.project))
    ]),
    m('tr', [
      m('td', m('.label', {
        'for': id('service')
      }, t('activity.service'))),
      m('td', selectView({ id: id('service'), options: scope.services }, scope.activity.service))
    ])
  ]))
}

module.exports = {
  controller: controller,
  view: view
}
