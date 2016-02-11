'use strict'

var m = require('mithril')
var t = require('../../lib/translation')

var activityApi = require('../../api/activity')

var grid = require('../utils/views/grid')
var tile = require('../utils/views/tile')
var configuration = require('../../lib/configuration')

var timesliceList = require('./timesliceList')

var btnStartStop = require('./btnStartStop')

var formBuilder = require('../utils/components/formBuilder')
var toggleButton = require('../utils/components/toggleButton')

function controller (activityScope) {
  var scope = {
    activity: activityScope.activity,
    showDetails: false
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
    key: 'startstop-' + scope.activity.uuid,
    activity: scope.activity
  }))

  options.actions.push(m.component(toggleButton, {
    iconName: '.icon-edit',
    currentState: () => { return scope.showDetails },
    changeState: (state) => { scope.showDetails = state }
  }))

  if (scope.showDetails) {
    options.subs.push(grid(
      m.component(formBuilder, {
        key: 'form-' + scope.activity.uuid,
        model: scope.activity,
        onSubmit: scope.onSubmit,
        onDelete: scope.onDelete
      }),
      m.component(timesliceList, {
        key: 'timeslices-' + scope.activity.uuid,
        activity: scope.activity
      })
    ))
  }

  var inner = []
  inner.push(m('span', scope.activity.description));
  ['customer', 'project', 'service'].forEach((relation) => {
    if (scope.activity[relation]) {
      let shortcut = configuration.activity.shortcuts[relation].value
      inner.push(m('span.badge', shortcut + scope.activity[relation].alias))
    }
  })

  return tile(inner, options)
}

module.exports = {
  controller: controller,
  view: view
}
