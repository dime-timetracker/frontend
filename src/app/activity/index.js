'use strict'

const api = require('src/api/activity')
const buttonView = require('src/app/utils/views/button')
const card = require('src/app/utils/views/card/default')
const customerApi = require('src/api/customer')
const debug = require('debug')('app.activity')
const itemView = require('./item')
const m = require('src/lib/mithril')
const moment = require('moment')
const projectApi = require('src/api/project')
const serviceApi = require('src/api/service')
const shellActivities = require('./shell/activity')
const shellFilter = require('./shell/filter')
const t = require('src/lib/translation')
const timesliceApi = require('src/api/timeslice')
const timesliceDuration = require('src/app/timeslice').duration
const timesliceRunning = require('src/app/timeslice').running
const userSettings = require('src/app/setting').sections

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
  m.startComputation()
  timesliceApi.persist({
    activity_id: parseInt(activity.id),
    started_at: moment().format(timestampFormat)
  }).then((timeslice) => {
    activity.timeslices.unshift(timeslice)
    m.endComputation()
  }, m.endComputation)
}

function stop (activity) {
  activity.timeslices.forEach((t) => {
    if (!t.stopped_at) {
      t.stopped_at = moment().format(timestampFormat)
      t.duration = timesliceDuration(t)
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
      api.fetchNext().then((bunch) => {
        Array.prototype.push.apply(scope.activities, bunch)
        assignRelations(scope)
      })
    } }, t('Show more')))
  }

  container.push(buttonView('Add Activity', '/', scope.add))

  return m('.tile-wrap', container)
}

function assignRelations (scope) {
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
}

function controller () {
  debug('Running activity index controller')
  const scope = {
    activities: [],
    visibleActivities: [],
    customers: [],
    projects: [],
    services: []
  }
  const promiseActivities = api.fetchBunch().then((list) => {
    scope.activities = list
    debug('showing', list.length)
    scope.visibleActivities = list
    scope.total = api.total()
    debug('showing', list.length, 'of', scope.total)
  })
  const promiseCustomers = customerApi.getCollection().then((customers) => {
    scope.customers = customers
  })
  const promiseProjects = projectApi.getCollection().then((projects) => {
    scope.projects = projects
  })
  const promiseServices = serviceApi.getCollection().then((services) => {
    scope.services = services
  })
  Promise.all([
    promiseActivities,
    promiseCustomers,
    promiseProjects,
    promiseServices
  ]).then(() => {
    assignRelations(scope)
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

module.exports = { controller, running, start, stop, totalDuration, view }
