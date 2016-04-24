'use strict'

const m = require('mithril')
const t = require('../../../lib/translation')
const formatShortcut = require('../../../lib/helper/mousetrapCommand')
const debug = global.window.dimeDebug('shell.activity')
const parse = require('../../../lib/parser').parse
const shell = require('../shell')
const api = require('../../../api/activity')

function createActivity (e, scope) {
  const string = e.target.value
  if (string) {
    const parsers = ['customer', 'project', 'service', 'tags', 'times', 'description']
    debug('Creating activity by ' + string)
    const activity = parse(string, parsers)
    scope.addActivity(activity)
  }
  e.target.value = ''
  e.target.blur()
}

function inputView (scope) {
  return m('input.form-control.mousetrap', {
    id: scope.htmlId,
    placeholder: scope.placeholder,
    onfocus: scope.focus,
    onblur: scope.blur,
    onkeydown: scope.keydown
  })
}

function controller (listScope) {
  const scope = {
    shortcut: 'd a',
    icon: 'icon-play-arrow',
    htmlId: 'shell',
    addActivity: (activity) => {
      api.persist(activity)
    }
  }
  scope.placeholder = ' ' + t('shell.activity.placeholder', {
    shortcut: formatShortcut(scope.shortcut)
  })
  scope.inputView = () => {
    return inputView(scope)
  }
  scope.onSubmit = (e) => { createActivity(e, scope) }
  scope.blur = (e) => { shell.blur(e, scope) }
  scope.focus = (e) => { shell.focus(e, scope) }
  shell.registerMouseEvents(scope)

  return scope
}

function view (scope) {
  return m.component(shell, scope)
}

module.exports = {
  controller: controller,
  view: view
}
