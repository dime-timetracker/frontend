'use strict'

var m = require('mithril')
var t = require('../../lib/translation')
var formatShortcut = require('../../lib/helper/mousetrapCommand')
var bookmarks = require('./filter/bookmarks')
var shell = require('../shell')
var settingsApi = require('../../api/setting')

function onSubmitFilter (e, scope) {
  scope.query = e.target.value
  scope.collection.reset()
  scope.collection.initialize({
    requestAttributes: {
      filter: scope.query
    },
    reset: true
  })
  scope.blur(e, scope)
}

function buttonReportView (scope) {
  return m('.media-object.pull-right',
    m('a[href="/report/' + encodeURIComponent(scope.query) + '"].form-icon-label', {
      config: m.route
    }, m('span.icon.icon-print'))
  )
}

function buttonBookmarkView (scope) {
  const isBookmarked = bookmarks.isKnownQuery(scope.query)
  return m('.media-object.pull-right',
    m('span.form-icon-label', {
      onclick: function () {
        bookmarks.add('', scope.query)
      }
    }, m('span.icon.icon-bookmark' + (isBookmarked ? '' : '-outline')))
  )
}

function inputView (scope) {
  return m('input.form-control.mousetrap', {
    id: scope.htmlId,
    placeholder: t('shell.filter.placeholder', {
      shortcut: scope.shortcut ? formatShortcut(scope.shortcut.value) : ''
    }),
    onfocus: scope.focus,
    onblur: scope.blur,
    onkeydown: scope.keydown,
    value: scope.query
  })
}

function controller (listScope) {
  var scope = {
    collection: listScope.collection,
    inputView: inputView,
    icon: 'icon-filter-list',
    htmlId: 'filter',
    query: listScope.query || null,
    shortcut: settingsApi.find('shell/shortcuts/focusFilter')
  }
  scope.onSubmit = (e) => { onSubmitFilter(e, scope) }
  scope.blur = (e) => { shell.blur(e, scope) }
  scope.focus = (e) => { shell.focus(e, scope) }
  scope.iconViews = [
    () => { return buttonReportView(scope) },
    () => { return buttonBookmarkView(scope) }
  ]
  scope.inputView = function () {
    return inputView(scope)
  }
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
