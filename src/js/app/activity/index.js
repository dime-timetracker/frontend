'use strict'

const m = require('mithril')
const moment = require('moment')
const t = require('../../lib/translation')

const api = require('../../api/activity')
const timesliceApi = require('../../api/timeslice')
const timesliceDuration = require('../timeslice').duration
const customerApi = require('../../api/customer')
const projectApi = require('../../api/project')
const serviceApi = require('../../api/service')

const debug = require('debug')('app.activity')

const buttonView = require('../utils/views/button')
const card = require('../utils/views/card/default')

const timesliceRunning = require('../timeslice').running
const shellActivities = require('../shell/activity')
const shellFilter = require('../shell/filter')
const itemView = require('./item')

const timestampFormat = 'YYYY-MM-DD HH:mm:ss'

require('../setting').sections.activity = require('./settings')

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
  m.startComputation()
  timesliceApi.persist(timeslice).then(() => {
    activity.timeslices.push(timeslice)
    m.endComputation()
  }, m.endComputation)
}

function stop (activity) {
  activity.timeslices.forEach((t) => {
    if (!t.stoppedAt) {
      t.stoppedAt = moment().format(timestampFormat)
      t.duration = moment(t.stoppedAt).diff(moment(t.startedAt))
      m.startComputation()
      timesliceApi.persist(t).then(() => {
        m.endComputation()
      }, m.endComputation)
    }
  })
}

function activityListView (scope) {
  var container = []

  debug('view list', scope.activities)
  container.push(scope.activities.map(function (activity) {
    return m.component(itemView, {
      activity: activity,
      key: activity.id,
      collection: scope.activities,
      running: running,
      totalDuration: totalDuration,
      start: start,
      stop: stop
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

function controller () {
  debug('Running activity index controller')
  var scope = {
    activities: [],
    customers: [],
    projects: [],
    services: []
  }
  api.fetchBunch().then((list) => {
    scope.activities = list
    scope.total = api.total()
  })
  customerApi.fetchAll().then((customers) => { scope.customers = customers })
  projectApi.fetchAll().then((projects) => { scope.projects = projects })
  serviceApi.fetchAll().then((services) => { scope.services = services })

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
