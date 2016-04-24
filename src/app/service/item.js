'use strict'

const m = require('src/lib/mithril')
const api = require('../../api/service')
const debug = require('debug')('app.service.item')
const t = require('../../lib/translation')
const userSettings = require('../setting').sections

const fieldViews = {
  input: require('../utils/views/formfields/input'),
  select: require('../utils/views/formfields/select'),
  boolean: require('../utils/views/formfields/selectBoolean')
}

function propertyView (scope, property) {
  if (scope.edit === property.name) {
    return m('.edit.property.' + property.name, m('.form-row', [
      m('.affix.prefix', (property.prefix || '')),
      m('.form-element', [
        m('label', t('service.property.' + property.name)),
        m('.value', [
          property.formElement({
            id: scope.key + '-' + property.name,
            name: property.name,
            change: (value) => {
              scope.service[property.name] = value
              api.persist(scope.service)
              scope.edit = null
            }
          }, scope.service[property.name] || '')
        ])
      ]),
      m('.affix.suffix', (property.postfix || ''))
    ]))
  }
  const valueOut = scope.service[property.name] === 0 || scope.service[property.name]
    ? (property.prefix || '') + scope.service[property.name] + (property.postfix || '')
    : m('em', t('service.property.missing', { property: t('service.property.' + property.name) }))
  return m('.property.' + property.name, {
    onclick: () => { scope.edit = property.name },
    title: t('property.edit', { property: t('service.property.' + property.name) })
  }, valueOut)
}

function controller (listContext) {
  const scope = {
    key: listContext.key,
    service: listContext.service,
    shortcut: userSettings.find('global.shortcuts.service'),
    edit: null
  }
  scope.requestStatusChange = (enable) => {
    const question = t('service.' + (enable ? 'enable' : 'disable') + '.confirm', {
      service: scope.service.name }
    )
    return function () {
      if (global.window.confirm(question)) {
        scope.service.enabled = enable
        api.persist(scope.service)
      }
    }
  }
  scope.onRemove = function () {
    const question = t('service.remove.confirm', { service: scope.service.name || '' })
    if (global.window.confirm(question)) {
      api.remove(scope.service)
      m.redraw()
    }
  }

  return scope
}

function view (scope) {
  return m('.col-md-3.col-sm-6', { key: scope.key }, m('.card', m('.card-main', [
    m('.card-inner', {
      onmouseleave: () => {
        if (scope.edit) { debug('quit editing ', scope.service.name); scope.edit = null }
      }
    }, [
      m('p.card-heading', { title: scope.service.name }, propertyView(scope, {
        name: 'name',
        formElement: fieldViews.input
      })), m('p.card-content', [
        propertyView(scope, {
          name: 'alias',
          formElement: fieldViews.input,
          prefix: scope.shortcut
        })
      ])
    ]),
    m('.card-action', [
      m('a.btn.btn-flat', { onclick: scope.onRemove }, t('Remove')),
      scope.service.enabled
      ? m('a.btn.btn-flat', { onclick: scope.requestStatusChange(false) }, t('service.disable'))
      : m('a.btn.btn-flat', { onclick: scope.requestStatusChange(true) }, t('service.enable'))
    ])
  ])))
}

module.exports = { controller, view }
