'use strict'

var m = require('mithril')
var t = require('../../lib/translation')

var activityApi = require('../../api/activity')

var activityForm = require('./form')
var grid = require('../utils/views/grid')
var tile = require('../utils/views/tile')
var settingsApi = require('../../api/setting')

var timesliceList = require('./timesliceList')

var btnStartStop = require('./btnStartStop')

var toggleButton = require('../utils/components/toggleButton')

function controller (activityScope) {
  var scope = {
    activity: activityScope.activity,
    customers: activityScope.customers,
    projects: activityScope.projects,
    services: activityScope.services,
    running: activityScope.running(activityScope.activity),
    totalDuration: activityScope.totalDuration(activityScope.activity),
    start: activityScope.start,
    stop: activityScope.stop,
    showDetails: false,
    shortcuts: {
      'customer': settingsApi.find('global.shortcuts.customer'),
      'project': settingsApi.find('global.shortcuts.project'),
      'service': settingsApi.find('global.shortcuts.service')
    }
  }

  scope.onSubmit = function (e) {
    if (e) {
      e.preventDefault()
    }

    activityApi.persist(scope.activity)
  }
  scope.onDelete = function (e) {
    if (e) {
      e.preventDefault()
    }

    var question = t('delete.confirm', { activity: scope.activity.description })
    if (global.window.confirm(question)) {
      activityApi.delete(scope.activity)
    }
  }

  return scope
}

function view (scope) {
  var options = {
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

  var inner = []
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
