'use strict'

const m = require('src/lib/mithril')
const mousetrap = require('mousetrap-pause')(require('mousetrap'))
const parse = require('src/lib/parser').parse
const settingsApi = require('src/api/setting')
const t = require('src/lib/translation')
const userSettings = require('src/app/setting').sections

const debug = require('debug')('app.shell')

userSettings.shell = require('./settings')

const autocompletionOptions = m.prop([])
const autocompletionTrigger = m.prop(() => {})
const autocompletionSelection = m.prop()
const autocompletionStatus = m.prop()

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
    mousetrap(e.target).bind(shortcut, (e) => { scope.onSubmit(e, scope) })
  })

  ;['customer', 'project', 'service', 'tag'].forEach(relation => {
    applySetting('global.shortcuts.' + relation, (shortcut) => {
      debug('Register shortcut to autocomplete ' + relation, shortcut)
      mousetrap(e.target).bind(shortcut, (e) => {
        debug(relation + ' autocompletion enabled')
        autocompletionTrigger((e) => {
          const parsed = parse(e.target.value)
          if (scope.autocompletion && scope.autocompletion[relation]) {
            const substring = parsed[relation] ? parsed[relation].alias : ''
            autocompletionStatus({ shortcut, substring })
            autocompletionOptions(scope.autocompletion[relation](substring))
            m.redraw()
          }
        })
      })
    })
  })

  ;['left', 'right', 'backspace', 'space', 'enter'].forEach(key => {
    mousetrap(e.target).bind(key, (e) => {
      autocompletionOptions([])
      autocompletionStatus({})
      autocompletionTrigger(() => {})
      debug('autocompletion disabled')
      m.redraw()
    })
  })

  applySetting('shell.shortcuts.cycleAutocompletion', key => {
    mousetrap(e.target).bind(key, (e) => {
      autocompletionSelection(
        autocompletionOptions()[autocompletionOptions().indexOf(autocompletionSelection()) + 1] ||
        autocompletionOptions()[0]
      )
      e.target.value = e.target.value.replace(
        new RegExp('(' + autocompletionStatus().shortcut + ')([^ ]*)($| )'),
        '$1' + autocompletionSelection() + '$3'
      )
      m.redraw()
      e.preventDefault()
      return false
    })
  })
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
    autocompletion: parentScope.autocompletion,
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
  parts.push(m('.media-inner', scope.inputView({
    autocompletionOptions,
    autocompletionSelection,
    autocompletionTrigger
  })))
  return m('.media', parts)
}

module.exports = {
  controller: controller,
  view: view,
  focus: focus,
  blur: blur,
  registerMouseEvents: registerMouseEvents
}
