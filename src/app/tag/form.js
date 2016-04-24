'use strict'

const m = require('mithril')
const t = require('../../lib/translation')
const api = require('../../api/tag')
const fieldViews = {
  input: require('../utils/views/formfields/input'),
  select: require('../utils/views/formfields/select'),
  boolean: require('../utils/views/formfields/selectBoolean')
}

function controller (context) {
  const scope = {
    tag: context.tag
  }

  scope.update = function (tag, e) {
    if (e) {
      e.preventDefault()
    }
    api.persist(tag)
  }

  return scope
}

function view (scope) {
  return m('.tag.' + scope.tag.alias, [
    m('p.row.form-group', [
      m('.col-md-3', t('tag.property.name')),
      m('.col-md-9', fieldViews.input({ name: 'name', change: (name) => {
        scope.tag.name = name
        scope.update(scope.tag)
      }}, scope.tag.name))
    ])
  ])
}

module.exports = {
  controller: controller,
  view: view
}
