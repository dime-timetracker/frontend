'use strict'

const m = require('src/lib/mithril')
const t = require('src/lib/translation')
const debug = require('debug')('app.shell.filter')
const formatShortcut = require('src/lib/helper/mousetrapCommand')
const bookmarks = require('./filter/bookmarks')
const shell = require('../shell')
const parse = require('src/lib/parser').parse
const settingsApi = require('src/api/setting')

function matchesFilter (filter) {
  return function (activity) {
    if (filter.customer) {
      if (!activity.customer || filter.customer.alias !== activity.customer.alias) {
        return false
      }
    }
    if (filter.project) {
      if (!activity.project || filter.project.alias !== activity.project.alias) {
        return false
      }
    }
    if (filter.service) {
      if (!activity.service || filter.service.alias !== activity.service.alias) {
        return false
      }
    }
    if (filter.description) {
      if (!activity.description || activity.description.indexOf(filter.description) === -1) {
        return false
      }
    }
    return true
  }
}

function onSubmitFilter (e, scope) {
  scope.query = e.target.value
  if (scope.listScope.onSubmitFilter) {
    scope.listScope.onSubmitFilter(scope.query)
  } else {
    const parsers = ['customer', 'project', 'service', 'tags', 'description']
    const filter = parse(scope.query, parsers)
    debug('Running filter', filter)
    scope.listScope.visibleActivities = scope.listScope.activities.filter(matchesFilter(filter))
    debug('Filter result: ', scope.listScope.visibleActivities)
  }
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
      onclick: () => {
        bookmarks.add(null, scope.query)
      }
    }, m('span.icon.icon-bookmark' + (isBookmarked ? '' : '-outline')))
  )
}

function inputView (scope) {
  return m('input.form-control.mousetrap', {
    id: scope.htmlId,
    placeholder: t('shell.filter.placeholder', {
      shortcut: scope.shortcut ? formatShortcut(scope.shortcut) : ''
    }),
    onfocus: scope.focus,
    onblur: scope.blur,
    onkeydown: scope.keydown,
    value: scope.query
  })
}

function controller (listScope) {
  bookmarks.init()
  const scope = {
    bookmarks: bookmarks.list(),
    inputView: inputView,
    icon: 'icon-filter-list',
    htmlId: 'filter',
    listScope: listScope,
    query: listScope.query || null,
    shortcut: settingsApi.find('shell.shortcuts.focusFilter')
  }
  scope.onSubmit = (e) => { onSubmitFilter(e, scope) }
  scope.blur = (e) => { shell.blur(e, scope) }
  scope.focus = (e) => { shell.focus(e, scope) }
  scope.iconViews = [
    () => { return buttonReportView(scope) },
    () => { return buttonBookmarkView(scope) }
  ]
  scope.inputView = () => {
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
