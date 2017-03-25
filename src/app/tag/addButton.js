'use strict'

const button = require('src/app/utils/views/button')
const m = require('src/lib/mithril')
const t = require('src/lib/translation')

const formVisible = m.prop(false)

function controller (listScope) {
  const scope = {
    add: function (e) {
      e.preventDefault()
      if (e.target.value) {
        listScope.add({ name: e.target.value })
        e.target.value = ''
        formVisible(false)
      }
    },
    toggle: function (e) {
      e.preventDefault()
      formVisible(!formVisible())
      return false
    }
  }

  return scope
}

function view (scope) {
  return button({
    title: t('tag.add'),
    buttonOptions: { onclick: scope.toggle },
    after: formVisible() ? m('.fbtn-miniform.fbtn-red', m('label', [
      t('tag.property.name'),
      m('input', { onchange: scope.add })
    ])) : null
  })
}

module.exports = { controller, view }
