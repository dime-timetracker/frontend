'use strict'

const m = require('src/lib/mithril')
const t = require('../../lib/translation')
const debug = require('debug')('app.activity.form')
const inputView = require('../utils/views/formfields/input')
const selectView = require('../utils/views/formfields/select')

function compareLabel (a, b) {
  const nameA = a.label.toUpperCase() // ignore upper and lowercase
  const nameB = b.label.toUpperCase() // ignore upper and lowercase
  if (nameA < nameB) {
    return -1
  }
  if (nameA > nameB) {
    return 1
  }

  // names must be equal
  return 0
}

function controller (context) {
  const scope = {
    activity: context.activity,
    customers: context.customers.map((customer) => { return { value: customer.id, label: customer.name } }),
    projects: context.projects.map((project) => { return { value: project.id, label: project.name } }),
    services: context.services.map((service) => { return { value: service.id, label: service.name } }),
    tags: context.tags,
    changes: {}
  }
  scope.customers.sort(compareLabel).unshift({})
  scope.projects.sort(compareLabel).unshift({})
  scope.services.sort(compareLabel).unshift({})
  scope.save = function () {
    Object.keys(scope.changes).forEach(field => {
      scope.activity[field] = scope.changes[field]
    })
    context.onSubmit()
    scope.changes = {}
  }
  return scope
}

function view (scope) {
  function id (field) {
    return 'activity-' + field + '-' + scope.activity.id
  }
  const customerId = scope.activity.customer ? scope.activity.customer.id : null
  const projectId = scope.activity.project ? scope.activity.project.id : null
  const serviceId = scope.activity.service ? scope.activity.service.id : null
  const buttons = []
  if (Object.keys(scope.changes).length) {
    buttons.push(m('a.btn.btn-green[href=#]', { onclick: scope.save }, m('span.icon.icon-done')))
  }
  return m('.table-responsive', m('table', [
    m('tr', [
      m('th', m('label', {
        'for': id('description')
      }, t('activity.description'))),
      m('td', inputView({
        id: id('description'),
        change: function (value) {
          scope.changes.description = value
        }
      }, scope.changes.description || scope.activity.description || ''))
    ]),
    m('tr', [
      m('th', m('label', {
        'for': id('customer')
      }, t('activity.customer'))),
      m('td', selectView({
        id: id('customer'),
        change: function (value) {
          const customerId = parseInt(value)
          scope.changes.customer_id = customerId
          scope.changes.customer = scope.customers.find(customer => customer.id === customerId)
        },
        options: scope.customers
      }, scope.changes.customer ? scope.changes.customer.id : customerId))
    ]),
    m('tr', [
      m('th', m('label', {
        'for': id('project')
      }, t('activity.project'))),
      m('td', selectView({
        id: id('project'),
        change: function (value) {
          const projectId = parseInt(value)
          scope.changes.project_id = projectId
          scope.changes.project = scope.projects.find(project => project.id === projectId)
        },
        options: scope.projects
      }, scope.changes.project ? scope.changes.project.id : projectId))
    ]),
    m('tr', [
      m('th', m('label', {
        'for': id('service')
      }, t('activity.service'))),
      m('td', selectView({
        id: id('service'),
        change: function (value) {
          const serviceId = parseInt(value)
          scope.changes.service_id = serviceId
          scope.changes.service = scope.services.find(service => service.id === serviceId)
        },
        options: scope.services
      }, scope.changes.service ? scope.changes.service.id : serviceId))
    ]),
    m('tr', [
      m('th', m('label', {
        'for': id('tags')
      }, t('activity.tags'))),
      m('td', inputView({
        id: id('tags'),
        change: function (value) {
          const tagNames = value.split('#').map(tag => tag.replace(/^#/, ''))
          scope.changes.tags = tagNames.map(tagName => {
            return scope.tags.find(tag => tag.name === tagName) || { name: tagName }
          })
          debug(tagNames, scope.changes)
        }
      }, (scope.changes.tags || scope.activity.tags || []).map(tag => tag.name).join(' ')))
    ]),
    m('tr', [
      m('td.buttons.text-right', { colspan: 2 },
        buttons
      )
    ])
  ]))
}

module.exports = {
  controller: controller,
  view: view
}
