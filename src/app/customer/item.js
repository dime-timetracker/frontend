'use strict'

const m = require('src/lib/mithril')
const api = require('../../api/customer')
const debug = require('debug')('app.customer.item')
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
        m('label', t('customer.property.' + property.name)),
        m('.value', [
          property.formElement({
            id: scope.key + '-' + property.name,
            name: property.name,
            change: (value) => {
              scope.customer[property.name] = value
              api.persist(scope.customer)
              scope.edit = null
            }
          }, scope.customer[property.name] || '')
        ])
      ]),
      m('.affix.suffix', (property.postfix || ''))
    ]))
  }
  const valueOut = scope.customer[property.name] === 0 || scope.customer[property.name]
    ? (property.prefix || '') + scope.customer[property.name] + (property.postfix || '')
    : m('em', t('customer.property.missing', { property: t('customer.property.' + property.name) }))
  return m('.property.' + property.name, {
    onclick: () => { scope.edit = property.name },
    title: t('property.edit', { property: t('customer.property.' + property.name) })
  }, valueOut)
}

function controller (listContext) {
  const scope = {
    key: listContext.key,
    customer: listContext.customer,
    shortcut: userSettings.find('global.shortcuts.customer'),
    edit: null
  }
  scope.requestStatusChange = (enable) => {
    const question = t('customer.' + (enable ? 'enable' : 'disable') + '.confirm', {
      customer: scope.customer.name }
    )
    return function () {
      if (global.window.confirm(question)) {
        scope.customer.enabled = enable
        api.persist(scope.customer)
      }
    }
  }
  scope.onRemove = function () {
    const question = t('customer.remove.confirm', { customer: scope.customer.name || '' })
    if (global.window.confirm(question)) {
      api.remove(scope.customer)
      m.redraw()
    }
  }

  return scope
}

function view (scope) {
  return m('.col-md-3.col-sm-6', { key: scope.key }, m('.card', m('.card-main', [
    m('.card-inner', {
      onmouseleave: () => {
        if (scope.edit) { debug('quit editing ', scope.customer.name); scope.edit = null }
      }
    }, [
      m('p.card-heading', { title: scope.customer.name }, propertyView(scope, {
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
      scope.customer.enabled
      ? m('a.btn.btn-flat', { onclick: scope.requestStatusChange(false) }, t('customer.disable'))
      : m('a.btn.btn-flat', { onclick: scope.requestStatusChange(true) }, t('customer.enable'))
    ])
  ])))
}

module.exports = { controller, view }