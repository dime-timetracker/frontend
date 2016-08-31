'use strict'

const activityApi = require('src/api/activity')
const cardView = require('src/app/utils/views/card/default')
const customerApi = require('src/api/customer')
const debug = require('debug')('app.report')
const duration = require('src/app/timeslice').duration
const m = require('src/lib/mithril')
const moment = require('moment')
const projectApi = require('src/api/project')
const serviceApi = require('src/api/service')
const shellFilter = require('src/app/shell/filter')
const itemView = require('./item')
const t = require('src/lib/translation')
const timesliceApi = require('src/api/timeslice')
const userSettings = require('src/app/setting').sections
userSettings.report = require('./settings')

function headerView () {
  return m('thead', m('tr', [
    m('th.description', t('report.table.header.description')),
    m('th.customer', t('report.table.header.customer')),
    m('th.project', t('report.table.header.project')),
    m('th.service', t('report.table.header.service')),
//    m('th.startedAt', t('report.table.header.startedAt')),
//    m('th.stoppedAt', t('report.table.header.stoppedAt')),
    m('th.duration', t('report.table.header.duration'))
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

function prepareCollection (scope) {
  const rows = JSON.parse(JSON.stringify(scope.collection)).map(row => {
    row.duration = duration(row, userSettings.find('report.precision'))
    return row
  })
  if (!scope.customMergeCode) {
    debug('no custom merger')
    return rows
  }
  try {
    debug('launch custom merger')
    const customMerge = function (rows) {
      return eval(scope.customMergeCode)
    }
    if (typeof customMerge === 'function') {
      debug('running custom merger')
      return customMerge(rows)
    }
  } catch (e) {
    debug('error running custom merger')
    debug(e)
    scope.warning = t('report.merge.invalid')
  }
  return rows
}

function controller () {
  const query = m.route.param('query') + ''
  const scope = {
    collection: [],
    query: decodeURIComponent(query.replace(/\+/g, '%20')),
    onSubmitFilter: function () {},
    customMergeCodeExamples: {
      groupByActivity: 'rows.reduce((result, row) => { if (undefined === result[row.activity.id]) { result[row.activity.id] = row; console.log(row) } else { result[row.activity.id].duration += row.duration; if (row.started_at < result[row.activity.id].started_at) { result[row.activity.id].started_at = row.started_at } }; if (result[row.activity.id].stopped_at < row.stopped_at) { result[row.activity.id].stopped_at = row.stopped_at }; return result }, [])'
    },
    customMergeCode: null
  }
  scope.customMergeCode = scope.customMergeCodeExamples.groupByActivity
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
    /*
    m('.query.merger', cardView(m.component(shellMerger, {
      update: function (code) { scope.customMergeCode = code },
      examples: scope.customMergeCodeExamples
    }))),
    */
    m('.table-responsive',
      m('table.table', [
        headerView(),
        m('tbody',
          prepareCollection(scope).map((timeslice) => m.component(itemView, { item: timeslice }))
        )
      ])
    )
  ])
}

module.exports = { controller, getFilterOptions, view, prepareCollection }
