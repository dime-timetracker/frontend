'use strict'

const m = require('mithril')
const t = require('../../lib/translation')
const api = require('../../api/project')
const fieldViews = {
  input: require('../utils/views/formfields/input'),
  select: require('../utils/views/formfields/select'),
  boolean: require('../utils/views/formfields/selectBoolean')
}

function controller (context) {
  const scope = {
    project: context.project
  }

  scope.update = function (project, e) {
    if (e) {
      e.preventDefault()
    }
    api.persist(project)
  }

  return scope
}

function view (scope) {
  return m('.project.' + scope.project.alias, [
    m('p.row.form-group', [
      m('.col-md-3', t('project.property.name')),
      m('.col-md-9', fieldViews.input({ name: 'name', change: (name) => {
        scope.project.name = name
        scope.update(scope.project)
      }}, scope.project.name))
    ]),
    m('p.row.form-group', [
      m('.col-md-3', t('project.property.alias')),
      m('.col-md-9', fieldViews.input({ name: 'alias', change: (alias) => {
        scope.project.alias = alias
        scope.update(scope.project)
      }}, scope.project.alias))
    ]),
    m('p.row.form-group', [
      m('.col-md-3', t('project.property.enabled')),
      m('.col-md-9', fieldViews.boolean({ name: 'alias', change: (enabled) => {
        scope.project.enabled = (enabled === '1')
        scope.update(scope.project)
      }}, scope.project.enabled))
    ])
  ])
}

module.exports = {
  controller: controller,
  view: view
}
