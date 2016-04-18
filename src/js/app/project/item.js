'use strict'

const m = require('mithril')
const t = require('../../lib/translation')
const tile = require('../utils/views/tile')
const form = require('./form')
const toggleButton = require('../utils/components/toggleButton')
const api = require('../../api/project')
const userSettings = require('../setting').sections

function controller (args) {
  var scope = {
    project: args.project,
    show: false
  }

  scope.onSubmit = (e) => {
    if (e) {
      e.preventDefault()
    }
    api.persist(scope.project)
    scope.show = false
  }

  scope.onDelete = function (e) {
    if (e) {
      e.preventDefault()
    }

    const question = t('delete.confirm', { name: scope.project.toString() })
    if (global.window.confirm(question)) {
      args.collection.remove(scope.project)
      scope.show = false
    }
  }

  return scope
}

function view (scope) {
  var inner = [
    scope.project.name
  ]
  if (scope.project.alias) {
    inner.push(m('span.badge', userSettings.find('global.shortcuts.project') + scope.project.alias))
  }

  var options = { active: scope.show }

  options.actions = m.component(toggleButton, {
    iconName: '.icon-edit',
    currentState: () => {
      return scope.show
    },
    changeState: (state) => {
      scope.show = state
    }
  })

  if (scope.show) {
    options.subs = m.component(form, {
      key: 'form-' + scope.project.uuid,
      project: scope.project,
      onSubmit: scope.onSubmit,
      onDelete: scope.onDelete
    })
  }

  return tile(inner, options)
}

module.exports = {
  controller: controller,
  view: view
}
