'use strict'

const activityApi = require('src/api/activity')
const cardView = require('src/app/utils/views/card/default')
const customerApi = require('src/api/customer')
const debug = require('debug')('app.report')
const m = require('src/lib/mithril')
const moment = require('moment')
const projectApi = require('src/api/project')
const serviceApi = require('src/api/service')
const shellFilter = require('src/app/shell/filter')
const t = require('src/lib/translation')
const timesliceApi = require('src/api/timeslice')

function itemView (scope, timeslice) {
  return m('tr.timeslice', [
    m('td.activity.description', timeslice.activity.description),
    m('td.activity.customer', timeslice.activity.customer ? timeslice.activity.customer.name : ''),
    m('td.activity.project', timeslice.activity.project ? timeslice.activity.project.name : ''),
    m('td.activity.service', timeslice.activity.service ? timeslice.activity.service.name : ''),
    m('td.startedAt', timeslice.started_at),
    m('td.stoppedAt', timeslice.stopped_at)
  ])
}

function headerView (scope) {
  return m('thead', m('tr', [
    m('th.description', t('description')),
    m('th.customer', t('customer')),
    m('th.project', t('project')),
    m('th.service', t('service')),
    m('th.startedAt', t('report.table.header.startedAt')),
    m('th.stoppedAt', t('report.table.header.stoppedAt'))
  ]))
}

function getFilterOptions (customers, projects, services) {
  return function (query) {
    const parsers = ['customer', 'project', 'service', 'tags', 'filterTimes', 'description']
    const filters = require('src/lib/parser').parse(query, parsers)
    const options = { parameters: {} }
    if (filters.customer) {
      let customer = customers.find((customer) => customer.alias === filters.customer.alias)
      if (customer) {
        options.parameters['by[customer]'] = customer.id
      }
    }
    if (filters.project) {
      let project = projects.find((project) => project.alias === filters.project.alias)
      if (project) {
        options.parameters['by[project]'] = project.id
      }
    }
    if (filters.service) {
      let service = services.find((service) => service.alias === filters.service.alias)
      if (service) {
        options.parameters['by[service]'] = service.id
      }
    }
    if (filters.description) {
      options.parameters['by[search]'] = '%' + filters.description + '%'
    }
    if (filters.filterStart || filters.filterStop) {
      let start = filters.filterStart ? moment(filters.filterStart).format('YYYY-MM-DD') : null
      let stop = filters.filterStop ? moment(filters.filterStop).format('YYYY-MM-DD') : null
      options.parameters['by[date]'] = (start || '') + ';' + (stop || '')
    }
    return options
  }
}

function onFetch (customers, projects, services) {
  return function (scope, options) {
    Promise.all([
      activityApi.fetchAll(options),
      timesliceApi.fetchAll(options)
    ]).then(function ([activities, timeslices]) {
      debug('filtered activities', activities)
      scope.collection = timeslices.map((timeslice) => {
        const activity = activities.find((activity) => (activity.id === timeslice.activity_id))
        if (activity) {
          timeslice.activity = activity
          timeslice.activity.customer = customers.find((customer) => (
            customer.id === timeslice.activity.customer_id
          ))
          timeslice.activity.project = projects.find((project) => (
            project.id === timeslice.activity.project_id
          ))
          timeslice.activity.service = services.find((service) => (
            service.id === timeslice.activity.service_id
          ))
          return timeslice
        }
      }).filter((timeslice) => timeslice)
      m.redraw()
    })
  }
}

function controller () {
  const query = m.route.param('query') + ''
  const scope = {
    collection: [],
    query: decodeURIComponent(query.replace(/\+/g, '%20')),
    onSubmitFilter: function () {}
  }
  Promise.all([
    customerApi.getCollection(),
    projectApi.getCollection(),
    serviceApi.getCollection()
  ]).then(function ([customers, projects, services]) {
    const filter = getFilterOptions(customers, projects, services)
    const fetch = onFetch(customers, projects, services)
    scope.onSubmitFilter = function (query) {
      fetch(scope, filter(query))
    }
    debug('Registered filter submit event')
    scope.onSubmitFilter(scope.query)
    m.redraw()
  })

  return scope
}

function view (scope) {
  return m('.report', [
    m('.query.filter', cardView(m.component(shellFilter, scope))),
    m('.table-responsive',
      m('table.table', [
        headerView(scope),
        m('tbody',
          scope.collection.map((timeslice) => itemView(scope, timeslice))
        )
      ])
    )
  ])
}

module.exports = { controller, getFilterOptions, view }
