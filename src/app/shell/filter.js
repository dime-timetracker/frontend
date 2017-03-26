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
    if (filter.tags) {
      if (!filter.tags.some(filterTag => activity.tags.some(
        activityTag => filterTag.name === activityTag.name
      ))) {
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
    m('a[href="/report/' + encodeURIComponent(scope.query || '') + '"].form-icon-label', {
      config: m.route
    }, 'Σ')
  )
}

function buttonBookmarkView (scope) {
  const isBookmarked = bookmarks.isKnownQuery(scope.query)
  return m('.media-object.pull-right',
    m('span.form-icon-label', {
      onclick: () => {
        if (isBookmarked) {
          bookmarks.remove(scope.query, 'query')
        } else {
          bookmarks.add(null, scope.query).then(() => {
            const selectorHandle = document.querySelector('.filter .bookmarks')
            if (selectorHandle) {
              selectorHandle.style.backgroundColor = window.getComputedStyle(document.querySelector('header')).backgroundColor
              setTimeout(() => {
                selectorHandle.style.backgroundColor = ''
              }, 300)
            }
          })
        }
      }
    }, m('span.icon.icon-bookmark' + (isBookmarked ? '' : '-outline')))
  )
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
      placeholder: t('shell.filter.placeholder', {
        shortcut: scope.shortcut ? formatShortcut(scope.shortcut) : ''
      }),
      onblur: scope.blur,
      onfocus: scope.focus,
      onkeyup: scope.autocompletionTrigger ? scope.autocompletionTrigger() : null
    }),
    suggestions
  ]
}

function controller (listScope) {
  bookmarks.init()
  const scope = {
    autocompletionOptions: m.prop([]),
    autocompletionTrigger: m.prop(() => {}),
    autocompletionSelection: m.prop(),
    autocompletionStatus: m.prop(),
    bookmarks: bookmarks.list(),
    icon: 'icon-filter-list',
    inputView: options => inputView(Object.assign(scope, options)),
    htmlId: 'filter',
    listScope: listScope,
    query: listScope.query || null,
    shortcut: settingsApi.find('shell.shortcuts.focusFilter')
  }
  scope.autocompletion = ['customer', 'project', 'service', 'tag'].reduce((result, relation) => {
    result[relation] = substring => {
      return listScope[relation + 's'].filter(item => {
        return item.enabled && ('' + (item.alias || item.name)).indexOf(substring) === 0
      }).map(item => (item.alias || item.name))
    }
    return result
  }, {})
  scope.onSubmit = (e) => { onSubmitFilter(e, scope) }
  scope.blur = (e) => { shell.blur(e, scope) }
  scope.focus = (e) => { shell.focus(e, scope) }
  scope.iconViews = [
    () => buttonReportView(scope),
    () => scope.query ? buttonBookmarkView(scope) : null
  ]
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
