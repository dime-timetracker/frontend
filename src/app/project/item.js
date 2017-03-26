'use strict'

const m = require('src/lib/mithril')
const api = require('../../api/project')
const customerApi = require('../../api/customer')
const t = require('../../lib/translation')
const ticketUrl = require('./ticketUrl')
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
        m('label', t('project.property.' + property.name)),
        m('.value', [
          property.formElement({
            id: scope.key + '-' + property.name,
            name: property.name,
            change: (value) => {
              scope.project[property.name] = value
              api.persist(scope.project)
              scope.edit = null
            }
          }, scope.project[property.name] || '')
        ])
      ]),
      m('.affix.suffix', (property.postfix || ''))
    ]))
  }
  const valueOut = scope.project[property.name] === 0 || scope.project[property.name]
    ? (property.prefix || '') + scope.project[property.name] + (property.postfix || '')
    : m('em', t('project.property.missing', { property: t('project.property.' + property.name) }))
  return m('.property.' + property.name, {
    onclick: () => { scope.edit = property.name },
    title: t('property.edit', { property: t('project.property.' + property.name) })
  }, valueOut)
}

function relationView (scope, property) {
  if (scope.edit === property.name) {
    return m('.edit.property.' + property.name, m('.form-row', [
      m('.affix.prefix', (property.prefix || '')),
      m('.form-element', [
        m('label', t('project.property.' + property.name)),
        m('.value', property.formElement({
          id: scope.key + '-' + property.name,
          name: property.name,
          options: property.relatedCollection.reduce((result, item) => {
            result.push({ value: item.id, label: item.name, item: item })
            return result
          }, [{ label: '–' }]),
          change: (value) => {
            scope.project[property.name + '_id'] = value
            scope.project[property.name] = property.relatedCollection.filter((item) => {
              return '' + item.id === value
            })[0]
            api.persist(scope.project)
            scope.edit = null
          }
        }, scope.project[property.name + '_id']))
      ]),
      m('.affix.suffix', (property.postfix || ''))
    ]))
  }
  const valueOut = scope.project[property.name]
    ? scope.project[property.name].name || m('em', scope.customerShortcut + scope.project[property.name].alias)
    : m('em', t('project.property.missing', { property: t('project.property.' + property.name) }))
  return m('.property.' + property.name, {
    onclick: () => { scope.edit = property.name },
    title: t('property.edit', { property: t('project.property.' + property.name) })
  }, valueOut)
}

function controller (listContext) {
  const scope = {
    customerShortcut: userSettings.find('global.shortcuts.customer'),
    customers: [],
    edit: null,
    enabled: listContext.enabled,
    key: listContext.key,
    project: listContext.project,
    shortcut: userSettings.find('global.shortcuts.project')
  }
  customerApi.getCollection().then((customers) => {
    scope.customers = customers
  })
  scope.requestStatusChange = (enable) => {
    const question = t('project.' + (enable ? 'enable' : 'disable') + '.confirm', {
      project: scope.project.name }
    )
    return function () {
      if (global.window.confirm(question)) {
        scope.project.enabled = enable ? 1 : 0
        api.persist(scope.project)
      }
    }
  }
  scope.onRemove = function () {
    const question = t('project.remove.confirm', { project: scope.project.name || '' })
    if (global.window.confirm(question)) {
      api.remove(scope.project)
    }
  }

  return scope
}

function view (scope) {
  const tag = scope.enabled ? '.col-md-3.col-sm-6' : '.col-md-2.col-sm-4'
  return m(tag, { key: scope.key }, m('.card', m('.card-main', [
    m('.card-inner', [
      m('p.card-heading', { title: scope.project.name }, propertyView(scope, {
        name: 'name',
        formElement: fieldViews.input
      })), m('p.card-content', [
        propertyView(scope, {
          name: 'alias',
          formElement: fieldViews.input,
          prefix: scope.shortcut
        }),
        relationView(scope, {
          name: 'customer',
          formElement: fieldViews.select,
          relatedCollection: scope.customers
        }),
        propertyView(scope, {
          name: 'rate',
          formElement: fieldViews.input,
          postfix: '\u00a0' + t('default.currency')
        }),
        m.component(ticketUrl, { project: scope.project })
      ])
    ]),
    m('.card-action', [
      m('a.btn.btn-flat', { onclick: scope.onRemove }, t('Remove')),
      scope.project.enabled
      ? m('a.btn.btn-flat', { onclick: scope.requestStatusChange(false) }, t('project.disable'))
      : m('a.btn.btn-flat', { onclick: scope.requestStatusChange(true) }, t('project.enable'))
    ])
  ])))
}

module.exports = { controller, view }
