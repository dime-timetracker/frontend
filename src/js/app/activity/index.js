'use strict'

const m = require('mithril')
const moment = require('moment')
const t = require('../../lib/translation')

const api = require('../../api/activity')
const timesliceApi = require('../../api/timeslice')
const timesliceDuration = require('../timeslice').duration

const debug = require('debug')('app.activities')

const configuration = require('../../lib/configuration')
configuration.addSection(require('../shell/config'))
configuration.addSection(require('./config'))

const buttonView = require('../utils/views/button')
const card = require('../utils/views/card/default')

const timesliceRunning = require('../timeslice').running
const shellActivities = require('../shell/activity')
const shellFilter = require('../shell/filter')
const itemView = require('./item')

const timestampFormat = 'YYYY-MM-DD HH:mm:ss';

function activityListView (scope) {
  var container = []

  debug('view list', scope.activities)
  container.push(scope.activities.map(function (activity) {
    return m.component(itemView, {
      activity: activity,
      key: activity.uuid,
      collection: scope.activities
    })
  }, scope))

  if (scope.activities.length < scope.total) {
    container.push(m('a.margin-top.btn.btn-block[href=#]', { onclick: function (e) {
      if (e) {
        e.preventDefault()
      }
      scope.activities.fetchNext()
    } }, t('Show more')))
  }

  container.push(buttonView('Add Activity', '/', scope.add))

  return m('.tile-wrap', container)
}

function running (activity) {
  return activity.timeslices.reduce((running, timeslice) => {
    return running || timesliceRunning(timeslice)
  }, false)
}

function totalDuration (activity) {
  return activity.timeslices.reduce(function (sum, timeslice) {
    return sum + timesliceDuration(timeslice)
  }, 0)
}

function start (activity) {
  let timeslice = {
    activity: parseInt(activity.id),
    startedAt: moment()
  }
  timesliceApi.persist(timeslice).then(() => {
    activity.timeslices.push(timeslice)
  })
}

function stop (activity) {
  activity.timeslices.forEach((t) => {
    if (!t.stoppedAt) {
      t.stoppedAt = moment().format(timestampFormat)
      t.duration = moment(t.stoppedAt).diff(moment(t.startedAt))
      timesliceApi.persist(t)
    }
  })
}

function controller () {
  debug('Running action controller')
  var scope = {
    activities: []
  }
  api.fetchBunch().then((list, foo) => {
    debug('Fetched bunch', list, foo)
    scope.activities = list
    scope.total = api.total()
  })

  scope.add = function (e) {
    if (e) {
      e.preventDefault()
    }
    scope.collection.add({})
  }

  return scope
}

function view (scope) {
  return m('.activities', [
    card(m.component(shellActivities, scope)),
    m('.filter', card(m.component(shellFilter, scope))),
    activityListView(scope)
  ])
}

module.exports = {
  running: running,
  start: start,
  stop: stop,
  totalDuration: totalDuration,
  controller: controller,
  view: view
}
