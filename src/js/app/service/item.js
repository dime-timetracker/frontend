'use strict'

const m = require('mithril')
const t = require('../../lib/translation')
const tile = require('../utils/views/tile')
const form = require('./form')
const toggleButton = require('../utils/components/toggleButton')
const api = require('../../api/service')
const userSettings = require('../setting').sections

function controller (args) {
  var scope = {
    service: args.service,
    show: false
  }

  scope.onSubmit = (e) => {
    if (e) {
      e.preventDefault()
    }
    api.persist(scope.service)
    scope.show = false
  }

  scope.onDelete = function (e) {
    if (e) {
      e.preventDefault()
    }

    const question = t('delete.confirm', { name: scope.service.toString() })
    if (global.window.confirm(question)) {
      args.collection.remove(scope.service)
      scope.show = false
    }
  }

  return scope
}

function view (scope) {
  var inner = [
    scope.service.name
  ]
  if (scope.service.alias) {
    inner.push(m('span.badge', userSettings.find('global.shortcuts.service') + scope.service.alias))
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
      key: 'form-' + scope.service.uuid,
      service: scope.service,
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
