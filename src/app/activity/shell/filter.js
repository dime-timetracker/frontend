'use strict'

const m = require('src/lib/mithril')
const t = require('../../../lib/translation')
const debug = require('debug')('app.shell.filter')
const formatShortcut = require('../../../lib/helper/mousetrapCommand')
const bookmarks = require('./filter/bookmarks')
const shell = require('../shell')
const parse = require('../../../lib/parser').parse
const settingsApi = require('../../../api/setting')

function onSubmitFilter (e, scope) {
  scope.query = e.target.value
  const parsers = ['customer', 'project', 'service', 'tags', 'description']
  const filter = parse(scope.query, parsers)
  debug('Running filter', filter)
  scope.listScope.activities = scope.listScope.visibleActivities.filter((activity) => {
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
  })
  debug('Filter result: ', scope.listScope.activities)
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
        bookmarks.add('', scope.query)
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
  const scope = {
    activities: listScope.activities,
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
