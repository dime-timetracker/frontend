'use strict'

const button = require('src/app/utils/views/button')
const m = require('src/lib/mithril')
const parse = require('src/lib/parser').parse
const t = require('src/lib/translation')

const formVisible = m.prop(false)

function controller (listScope) {
  const scope = {
    add: function (e) {
      e.preventDefault()
      if (e.target.value) {
        const parsers = ['customer', 'project', 'service', 'tags', 'times', 'description']
        const activity = parse(e.target.value, parsers)
        listScope.add(activity)
        e.target.value = ''
        formVisible(false)
      }
    },
    toggle: function (e) {
      e.preventDefault()
      formVisible(!formVisible())
    }
  }

  return scope
}

function view (scope) {
  return button({
    title: t('activity.add'),
    buttonOptions: { onclick: scope.toggle },
    after: formVisible() ? m('.fbtn-miniform.fbtn-red', m('label', [
      t('activity.description'),
      m('input', { onchange: scope.add })
    ])) : null
  })
}

module.exports = { controller, view }
