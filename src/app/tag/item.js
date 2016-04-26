'use strict'

const m = require('src/lib/mithril')
const t = require('../../lib/translation')
const tile = require('../utils/views/tile')
const form = require('./form')
const toggleButton = require('../utils/components/toggleButton')
const api = require('../../api/tag')
const userSettings = require('../setting').sections

function controller (args) {
  var scope = {
    tag: args.tag,
    show: false
  }

  scope.onSubmit = (e) => {
    if (e) {
      e.preventDefault()
    }
    api.persist(scope.tag)
    scope.show = false
  }

  scope.onDelete = function (e) {
    if (e) {
      e.preventDefault()
    }

    const question = t('delete.confirm', { name: scope.tag.toString() })
    if (global.window.confirm(question)) {
      args.collection.remove(scope.tag)
      scope.show = false
    }
  }

  return scope
}

function view (scope) {
  var inner = [
    scope.tag.name
  ]

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
      key: 'form-' + scope.tag.uuid,
      tag: scope.tag,
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
