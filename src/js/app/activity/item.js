'use strict'

const m = require('mithril')
const t = require('../../lib/translation')

const activityApi = require('../../api/activity')

const activityForm = require('./form')
const grid = require('../utils/views/grid')
const tile = require('../utils/views/tile')
const settingsApi = require('../../api/setting')

const timesliceList = require('./timesliceList')

const btnStartStop = require('./btnStartStop')

const toggleButton = require('../utils/components/toggleButton')

function controller (activityScope) {
  const scope = {
    activity: activityScope.activity,
    customers: activityScope.customers,
    projects: activityScope.projects,
    services: activityScope.services,
    running: activityScope.running,
    totalDuration: activityScope.totalDuration,
    start: activityScope.start,
    stop: activityScope.stop,
    showDetails: false,
    shortcuts: {
      'customer': settingsApi.find('global.shortcuts.customer'),
      'project': settingsApi.find('global.shortcuts.project'),
      'service': settingsApi.find('global.shortcuts.service')
    }
  }

  scope.onSubmit = (e) => {
    if (e) {
      e.preventDefault()
    }
    activityApi.persist(scope.activity)
  }
  scope.onDelete = (e) => {
    if (e) {
      e.preventDefault()
    }
    const question = t('delete.confirm', { activity: scope.activity.description })
    if (global.window.confirm(question)) {
      activityApi.delete(scope.activity)
    }
  }

  return scope
}

function view (scope) {
  const options = {
    active: scope.showDetails,
    actions: [],
    subs: []
  }
  options.actions.push(m.component(btnStartStop, {
    key: 'startstop-' + scope.activity.id,
    activity: scope.activity,
    running: scope.running,
    totalDuration: scope.totalDuration,
    start: scope.start,
    stop: scope.stop
  }))

  options.actions.push(m.component(toggleButton, {
    iconName: '.icon-edit',
    currentState: () => { return scope.showDetails },
    changeState: (state) => { scope.showDetails = state }
  }))

  if (scope.showDetails) {
    options.subs.push(grid(
      activityForm({
        activity: scope.activity,
        onSubmit: scope.onSubmit,
        onDelete: scope.onDelete,
        customers: scope.customers,
        projects: scope.projects,
        services: scope.services
      }),
      m.component(timesliceList, {
        key: 'timeslices-' + scope.activity.id,
        activity: scope.activity
      })
    ))
  }

  const inner = []
  inner.push(m('span', scope.activity.description));
  ['customer', 'project', 'service'].forEach((relation) => {
    if (scope.activity[relation]) {
      inner.push(m('span.badge', scope.shortcuts[relation] + scope.activity[relation].alias))
    }
  })

  return tile(inner, options)
}

module.exports = {
  controller: controller,
  view: view
}
