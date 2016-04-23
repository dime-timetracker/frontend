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
const shellActivities = require('./shell/activity')
const shellFilter = require('./shell/filter')
const itemView = require('./item')

const userSettings = require('../setting').sections
const timestampFormat = userSettings.find('global.timestamp.format')

userSettings.activity = require('./settings')

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
    activity_id: parseInt(activity.id),
    started_at: moment().format(timestampFormat)
  }
  m.startComputation()
  timesliceApi.persist(timeslice).then(() => {
    activity.timeslices.push(timeslice)
    m.endComputation()
  }, m.endComputation)
}

function stop (activity) {
  activity.timeslices.forEach((t) => {
    if (!t.stopped_at) {
      t.stopped_at = moment().format(timestampFormat)
      t.duration = moment(t.stopped_at, timestampFormat).diff(moment(t.started_at, timestampFormat))
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
    if (!activity.timeslices) {
      activity.timeslices = []
    }
    return m.component(itemView, {
      activity: activity,
      collection: scope.activities,
      customers: scope.customers,
      key: activity.id,
      projects: scope.projects,
      running: running,
      services: scope.services,
      start: start,
      stop: stop,
      totalDuration: totalDuration
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
    visibleActivities: [],
    customers: [],
    projects: [],
    services: []
  }
  const promiseActivities = api.fetchBunch().then((list) => {
    scope.activities = list
    scope.visibleActivities = list
    scope.total = api.total()
  })
  const promiseCustomers = customerApi.getCollection().then((customers) => {
    scope.customers = customers
  })
  const promiseProjects = projectApi.getCollection().then((projects) => {
    scope.projects = projects
  })
  const promiseServices = serviceApi.fetchAll().then((services) => {
    scope.services = services
  })
  Promise.all([
    promiseActivities,
    promiseCustomers,
    promiseProjects,
    promiseServices
  ]).then(() => {
    scope.activities.forEach((activity) => {
      activity.customer = scope.customers.find((customer) => {
        return customer.id === activity.customer_id
      })
      activity.project = scope.projects.find((project) => {
        return project.id === activity.project_id
      })
      activity.service = scope.services.find((service) => {
        return service.id === activity.service_id
      })
    })
    m.redraw()
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
