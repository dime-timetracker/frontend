'use strict'

const m = require('src/lib/mithril')
const mousetrap = require('mousetrap-pause')(require('mousetrap'))
const settingsApi = require('src/api/setting')
const t = require('src/lib/translation')
const userSettings = require('src/app/setting').sections

const debug = require('debug')('app.shell')

userSettings.shell = require('./settings')

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

function applySetting (name, action) {
  const setting = settingsApi.find(name)
  if (setting) {
    return action(setting)
  }
  debug('Could not apply setting', name, setting)
}

function focus (e, scope) {
  mousetrap(global.window).pause()

  applySetting('shell.shortcuts.blur', (shortcut) => {
    debug('Register shortcut to blur shell', shortcut)
    mousetrap(e.target).bind(shortcut, () => {
      e.target.value = ''
      blur(e, scope)
    })
  })

  applySetting('shell.shortcuts.submit', (shortcut) => {
    debug('Register shortcut to submit shell', shortcut)
    mousetrap(e.target).bind(shortcut, () => { scope.onSubmit(e, scope) })
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
}

function bookmarksView (bookmarks, onSubmit) {
  if (!bookmarks || !bookmarks.length) {
    return
  }
  let options = bookmarks.map((bookmark) => m('option', {
    value: bookmark.query
  }, bookmark.name || bookmark.query))
  options.unshift(m('option[value=""]', t('activity.filter.none')))
  return m('.bookmarks', m('select', { onchange: onSubmit }, options))
}

function controller (parentScope) {
  const scope = {
    bookmarks: parentScope.bookmarks,
    htmlId: parentScope.htmlId,
    icon: parentScope.icon,
    iconViews: parentScope.iconViews || [],
    inputView: parentScope.inputView,
    onSubmit: parentScope.onSubmit,
    shortcut: parentScope.shortcut
  }
  scope.focus = (e) => { focus(e, scope) }
  scope.blur = (e) => { blur(e, scope) }
  return scope
}

function view (scope) {
  const parts = scope.iconViews.map((view) => view())
  parts.unshift(
    m('.media-object.pull-left', [
      m('label.form-icon-label', {
        for: scope.htmlId
      }, m('span.icon.' + scope.icon)),
      bookmarksView(scope.bookmarks, scope.onSubmit)
    ])
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