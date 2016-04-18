'use strict'

const m = require('mithril')
const t = require('../../lib/translation')
const api = require('../../api/service')
const fieldViews = {
  input: require('../utils/views/formfields/input'),
  select: require('../utils/views/formfields/select'),
  boolean: require('../utils/views/formfields/selectBoolean')
}

function controller (context) {
  const scope = {
    service: context.service
  }

  scope.update = function (service, e) {
    if (e) {
      e.preventDefault()
    }
    api.persist(service)
  }

  return scope
}

function view (scope) {
  return m('.service.' + scope.service.alias, [
    m('p.row.form-group', [
      m('.col-md-3', t('service.property.name')),
      m('.col-md-9', fieldViews.input({ name: 'name', change: (name) => {
        scope.service.name = name
        scope.update(scope.service)
      }}, scope.service.name))
    ]),
    m('p.row.form-group', [
      m('.col-md-3', t('service.property.alias')),
      m('.col-md-9', fieldViews.input({ name: 'alias', change: (alias) => {
        scope.service.alias = alias
        scope.update(scope.service)
      }}, scope.service.alias))
    ]),
    m('p.row.form-group', [
      m('.col-md-3', t('service.property.enabled')),
      m('.col-md-9', fieldViews.boolean({ name: 'alias', change: (enabled) => {
        scope.service.enabled = (enabled === '1')
        scope.update(scope.service)
      }}, scope.service.enabled))
    ])
  ])
}

module.exports = {
  controller: controller,
  view: view
}
