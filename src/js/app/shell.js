'use strict'

const m = require('mithril')
const mousetrap = require('mousetrap-pause')(require('mousetrap'))
const settingsApi = require('../api/setting')

function registerMouseEvents (scope) {
  if (scope.shortcut) {
    mousetrap(global.window).bind(scope.shortcut, () => {
      global.window.document.getElementById(scope.htmlId).focus()
      return false
    })
  }
}

function blur (e) {
  mousetrap(global.window).unpause()
  e.target.blur()
}

function focus (e, scope) {
  mousetrap(global.window).pause()

  settingsApi.find('shell/shortcuts/blurShell').then((shortcut) => {
    if (shortcut) {
      mousetrap(e.target).bind(shortcut, () => {
        e.target.value = ''
        blur(e, scope)
      })
    }
  })

  /*
  mousetrap(e.target).bind(configuration.get('shell/shortcuts/triggerAutocompletion'), function (triggerEvent) {
    scope.module.autocomplete(triggerEvent, scope);
    return false;
  });
  mousetrap(e.target).bind(configuration.get('shell/shortcuts/cycleSuggestionsLeft'), function () {
    scope.module.cycleSuggestions('left', e, scope);
    return false;
  });
  mousetrap(e.target).bind(configuration.get('shell/shortcuts/cycleSuggestionsRight'), function () {
    scope.module.cycleSuggestions('right', e, scope);
    return false;
  });
  mousetrap(e.target).bind('space', function () {
    scope.module.clearSuggestions(e, scope);
  });
  */
  settingsApi.find('shell/shortcuts/submit').then((shortcut) => {
    if (shortcut) {
      mousetrap(e.target).bind(shortcut, () => { scope.onSubmit(e, scope) })
    }
  })
}

function controller (parentScope) {
  var scope = {
    htmlId: parentScope.htmlId,
    icon: parentScope.icon,
    iconViews: parentScope.iconViews || [],
    inputView: parentScope.inputView,
    shortcut: parentScope.shortcut
  }
  scope.focus = (e) => { focus(e, scope) }
  scope.blur = (e) => { blur(e, scope) }
  return scope
}

function view (scope) {
  var parts = scope.iconViews.map(function (view) {
    return view()
  })
  parts.unshift(
    m('.media-object.pull-left',
      m('label.form-icon-label', {
        for: scope.htmlId
      }, m('span.icon.' + scope.icon))
    )
  )
  parts.push(m('.media-inner', scope.inputView()))
  return m('.media', parts)
}

module.exports = {
  controller: controller,
  view: view,
  focus: focus,
  blur: blur,
  registerMouseEvents: registerMouseEvents
}
