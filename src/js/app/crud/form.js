'use strict'

/**
 * FormBuilder
 *
 * m.component(formBuilder, {
 *   key: UNIQUE,
 *   model: model,
 *   onSubmit: func,
 *   onCancel: func,
 *   onDelete: func
 * })
 */

var m = require('mithril')
var t = require('../../lib/translation')

var formGroup = require('../utils/views/formfields/group')
var inputField = require('../utils/views/formfields/input')
var selectField = require('../utils/views/formfields/select')
var selectBooleanField = require('../utils/views/formfields/selectBoolean')

function propertyField (property, model) {
  var input
  var options = {
    update: property.update
  }

  switch (property.type) {
    case 'boolean':
      input = selectBooleanField(model[property.key], options)
      break
    case 'select':
      options.selected = model[property.key]
      input = selectField(property.collection, options)
      break
    case 'relation':
      options.selected = (model[property.key]) ? model[property.key].alias : ''
      input = selectField(property.collection, options)
      break
    default:
      options.type = property.type
      input = inputField(model[property.key], options)
  }

  return formGroup(input, t(property.key))
}

function view (scope) {
  var content = []

  content.push(scope.properties.map((property) => {
    return propertyField(property, scope.model)
  }))

  var actions = [
    m('button.btn.btn-green.pull-right', {
      type: 'button',
      title: t('Save'),
      onclick: scope.onSubmit
    }, m('span.icon.icon-lg.icon-done'))
  ]

  if (scope.onDelete) {
    actions.push(m('button.btn.btn-red', {
      type: 'button',
      title: t('Delete'),
      onclick: scope.onDelete
    }, m('span.icon.icon-lg.icon-delete')))
  }

  content.push(m('.form-group-btn', actions))

  return m('.form', content)
}

module.exports = {
  controller: (scope) => { return scope },
  view: view
}
