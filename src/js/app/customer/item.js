'use strict'

const m = require('mithril')
const t = require('../../lib/translation')
const tile = require('../utils/views/tile')
const formBuilder = require('../utils/components/formBuilder')
const toggleButton = require('../utils/components/toggleButton')
const api = require('../../api/customer')

function controller (args) {
  var scope = {
    customer: args.customer,
    show: false
  }

  scope.onSubmit = (e) => {
    if (e) {
      e.preventDefault()
    }
    api.persist(scope.customer)
    scope.show = false
  }

  scope.onDelete = function (e) {
    if (e) {
      e.preventDefault()
    }

    const question = t('delete.confirm', { name: scope.customer.toString() })
    if (global.window.confirm(question)) {
      args.collection.remove(scope.customer)
      scope.show = false
    }
  }

  return scope
}

function view (scope) {
  var inner = [
    scope.customer.toString()
  ]
  if (scope.customer.alias) {
    inner.push(m('span.badge', scope.customer.shortcut + scope.customer.alias))
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
    options.subs = m.component(formBuilder, {
      key: 'form-' + scope.customer.uuid,
      customer: scope.customer,
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
