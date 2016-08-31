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
const shellActivities = require('src/app/shell/activity')
const shellFilter = require('src/app/shell/filter')
const t = require('src/lib/translation')
const tagApi = require('src/api/tag')
const timesliceApi = require('src/api/timeslice')
const timesliceDuration = require('src/app/timeslice').duration
const timesliceRunning = require('src/app/timeslice').running
const userSettings = require('src/app/setting').sections

const timestampFormat = userSettings.find('global.timestamp.format')
userSettings.activity = require('./settings')

function running (activity) {
  return activity.timeslices.some(timeslice => {
    return timesliceRunning(timeslice)
  })
}

function totalDuration (activity) {
  return activity.timeslices.reduce(function (sum, timeslice) {
    return sum + timesliceDuration(timeslice)
  }, 0)
}

function start (activity) {
  m.startComputation()
  timesliceApi
    .persist(timesliceApi.create(activity.id, timestampFormat))
    .then((timeslice) => {
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

  debug('view list', scope.visibleActivities)
  container.push(scope.visibleActivities.map(function (activity) {
    if (!activity.timeslices) {
      activity.timeslices = []
    }
    return m.component(itemView, {
      activity: activity,
      collection: scope.visibleActivities,
      customers: scope.customers,
      key: activity.id,
      projects: scope.projects,
      running: running,
      services: scope.services,
      start: start,
      stop: stop,
      tags: scope.tags,
      totalDuration: totalDuration
    })
  }, scope))

  if (scope.visibleActivities.length < scope.total) {
    container.push(m('a.margin-top.btn.btn-block[href=#]', { onclick: function (e) {
      if (e) {
        e.preventDefault()
      }
      api.fetchNext().then((bunch) => {
        Array.prototype.push.apply(scope.activities, bunch)
        Array.prototype.push.apply(scope.visibleActivities, bunch)
        assignRelations(scope)
      })
    } }, t('Show more')))
  }

  container.push(buttonView('Add Activity', '/', scope.add))

  return m('.tile-wrap', container)
}

function assignActivityRelations (scope) {
  return function (activity) {
    activity.customer = scope.customers.find((customer) => {
      return customer.id === activity.customer_id
    })
    activity.project = scope.projects.find((project) => {
      return project.id === activity.project_id
    })
    activity.service = scope.services.find((service) => {
      return service.id === activity.service_id
    })
    activity.tags = activity.tags.map(activityTag => scope.tags.find(tag => {
      return tag.id === activityTag || tag.id === activityTag.id
    }))
  }
}

function assignRelations (scope) {
  scope.activities.forEach(assignActivityRelations(scope))
  scope.visibleActivities.forEach(assignActivityRelations(scope))
}

function controller () {
  debug('Running activity index controller')
  const scope = {
    activities: [],
    visibleActivities: [],
    customers: [],
    projects: [],
    services: [],
    tags: []
  }
  scope.startNewActivity = function (activity) {
    if (activity.customer) {
      activity.customer = scope.customers.find(customer => customer.alias === activity.customer.alias)
      activity.customer_id = activity.customer ? activity.customer.id : undefined
    }
    if (activity.project) {
      activity.project = scope.projects.find(project => project.alias === activity.project.alias)
      if (activity.project) {
        activity.project_id = activity.project.id
        activity.customer_id = activity.project.customer_id
        activity.customer = scope.customers.find(customer => customer.id === activity.customer_id)
      }
    }
    if (activity.service) {
      activity.service = scope.services.find(service => service.alias === activity.service.alias)
      activity.service_id = activity.service ? activity.service.id : undefined
    }
    api.persist(activity).then((newActivity) => {
      assignActivityRelations(scope)(newActivity)
      scope.activities.unshift(newActivity)
      scope.visibleActivities.unshift(newActivity)
      start(newActivity)
    })
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
  const promiseTags = tagApi.getCollection().then((tags) => {
    scope.tags = tags
  })
  Promise.all([
    promiseActivities,
    promiseCustomers,
    promiseProjects,
    promiseServices,
    promiseTags
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
