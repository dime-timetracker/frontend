'use strict'

const m = require('mithril')
const api = require('../../api/project')
const debug = require('debug')('app.project.item')
const t = require('../../lib/translation')
const userSettings = require('../setting').sections

const fieldViews = {
  input: require('../utils/views/formfields/input'),
  select: require('../utils/views/formfields/select'),
  boolean: require('../utils/views/formfields/selectBoolean')
}

function propertyView (scope, property) {
  if (scope.edit === property.name) {
    return m('.edit.property.' + property.name, {
    }, [
      m('label', t('project.property.' + property.name)),
      m('.value', {
      }, property.formElement({
        id: scope.key + '-' + property.name,
        name: property.name,
        change: (value) => {
          scope.project[property.name] = value
          api.persist(scope.project)
        }
      }, scope.project[property.name]))
    ])
  }
  return m('.property.' + property.name, {
    onclick: () => { scope.edit = property.name },
    title: t('property.edit', { property: t('project.property.' + property.name) })
  }, (property.prefix || '') + scope.project[property.name] + (property.postfix || ''))
}

function controller (listContext) {
  const scope = {
    key: listContext.key,
    project: listContext.project,
    shortcut: userSettings.find('global.shortcuts.project'),
    edit: null
  }
  scope.requestStatusChange = (enable) => {
    const question = t('project.' + (enable ? 'enable' : 'disable') + '.confirm', {
      project: scope.project.name }
    )
    return function () {
      if (global.window.confirm(question)) {
        scope.project.enabled = enable
        api.persist(scope.project)
      }
    }
  }

  return scope
}

function view (scope) {
  return m('.col-md-3.col-sm-6', { key: scope.key }, m('.card', m('.card-main', [
    m('.card-inner', {
      onmouseleave: () => {
        if (scope.edit) { debug('quit editing ', scope.project.name); scope.edit = null }
      }
    }, [
      m('p.card-heading', { title: scope.project.name }, propertyView(scope, {
        name: 'name',
        formElement: fieldViews.input
      })), m('p.card-content', [
        propertyView(scope, {
          name: 'alias',
          formElement: fieldViews.input,
          prefix: scope.shortcut
        }),
        m('a', {
          config: m.route,
          href: '/customer/' + scope.project.customer.id
        }, scope.project.customer.name),
        propertyView(scope, {
          name: 'rate',
          formElement: fieldViews.input,
          postfix: ' ' + t('default.currency')
        })
      ])
    ]),
    m('.card-action', [
      m('a.btn.btn-flat', { onclick: scope.onDelete }, t('Delete')),
      scope.project.enabled
      ? m('a.btn.btn-flat', { onclick: scope.requestStatusChange(false) }, t('project.disable'))
      : m('a.btn.btn-flat', { onclick: scope.requestStatusChange(true) }, t('project.enable'))
    ])
  ])))
}

module.exports = { controller, view }
