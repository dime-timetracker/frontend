'use strict'

const m = require('src/lib/mithril')
const t = require('src/lib/translation')
const formatShortcut = require('src/lib/helper/mousetrapCommand')
const debug = global.window.dimeDebug('shell.activity')
const parse = require('src/lib/parser').parse
const settingsApi = require('src/api/setting')
const shell = require('../shell')

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
  let suggestions = null
  if (scope.autocompletionOptions().length) {
    suggestions = m('.suggestions', scope.autocompletionOptions().map(option => {
      return m('.suggestion' + (scope.autocompletionSelection() === option ? '.selected' : ''), option)
    }))
  }
  return [
    m('input.form-control.mousetrap', {
      autocompletion: scope.autocompletion,
      id: scope.htmlId,
      placeholder: scope.placeholder,
      onfocus: scope.focus,
      onblur: scope.blur,
      onkeydown: scope.keydown,
      onkeyup: scope.autocompletionTrigger ? scope.autocompletionTrigger() : null
    }),
    suggestions
  ]
}

function controller (listScope) {
  const scope = {
    addActivity: listScope.startNewActivity,
    htmlId: 'shell',
    icon: 'icon-add',
    shortcut: settingsApi.find('shell.shortcuts.focusActivity')
  }
  scope.autocompletion = ['customer', 'project', 'service', 'tag'].reduce((result, relation) => {
    result[relation] = substring => {
      return listScope[relation + 's'].filter(item => {
        return item.enabled && (item.alias || item.name).indexOf(substring) === 0
      }).map(item => (item.alias || item.name))
    }
    return result
  }, {})
  scope.placeholder = ' ' + t('shell.activity.placeholder', {
    shortcut: formatShortcut(scope.shortcut)
  })
  scope.inputView = (options) => {
    return inputView(Object.assign(scope, options))
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
