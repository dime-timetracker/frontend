'use strict'

const activityApi = require('src/api/activity')
const cardView = require('src/app/utils/views/card/default')
const customerApi = require('src/api/customer')
const debug = require('debug')('app.report')
const duration = require('src/app/timeslice').duration
const m = require('src/lib/mithril')
const moment = require('moment')
const projectApi = require('src/api/project')
const tagApi = require('src/api/tag')
const serviceApi = require('src/api/service')
const shellFilter = require('src/app/shell/filter')
const shellMerger = require('src/app/shell/merger')
const itemView = require('./item').view
const t = require('src/lib/translation')
const timesliceApi = require('src/api/timeslice')
const totalsView = require('./totals').view
const userSettings = require('src/app/setting').sections
userSettings.report = require('./settings')

function headerView (columns) {
  return m('thead', m('tr', columns.map(col => m('th.' + col, t('report.table.header.' + col)))))
}

function getFilterOptions (customers, projects, services, tags) {
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

function onFetch (customers, projects, services, tags) {
  return function (scope, options) {
    Promise.all([
      activityApi.fetchAll(options),
      timesliceApi.fetchAll(options)
    ]).then(function ([activities, timeslices]) {
      debug('filtered activities', activities)
      scope.collection(timeslices.map((timeslice) => {
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
          timeslice.activity.tags = timeslice.activity.tags.map(tagId => tags.find(tag => tag.id === tagId))
          return timeslice
        }
      }).filter((timeslice) => timeslice))
      prepareCollection(scope)
    })
  }
}

function prepareCollection (scope) {
  let rows = JSON.parse(JSON.stringify(scope.collection())).map(row => {
    row.duration = duration(row, userSettings.find('report.precision'))
    return row
  })
  if (!scope.customMergeCode) {
    debug('no custom merger')
    scope.rows(rows)
    m.redraw()
    return
  }
  try {
    debug('running custom merger')
    rows = eval(scope.customMergeCode()) || []
    if (Array.isArray(rows) === false) {
      debug('This should have been an array:', rows)
      return
    }
  } catch (e) {
    debug('error running custom merger', e)
    return
  }
  scope.rows(rows)
  m.redraw()
}

function controller () {
  const query = m.route.param('query') + ''
  const scope = {
    collection: m.prop([]),
    columns: m.prop([
      'description',
      'customer',
      'project',
      'service',
      'tags',
      'startedAt',
      'stoppedAt',
      'duration'
    ]),
    query: decodeURIComponent(query.replace(/\+/g, '%20')),
    onSubmitFilter: function () {},
    customMergeCode: m.prop('[]'),
    rows: m.prop([])
  }
  scope.customMergeCodeExamples = {
    groupByActivity: `rows.reduce((result, row) => {
  if (undefined === result[row.activity.id]) {
    result[row.activity.id] = row
  } else {
    result[row.activity.id].duration += row.duration
    if (row.started_at < result[row.activity.id].started_at) {
      result[row.activity.id].started_at = row.started_at
    }
  }
  if (result[row.activity.id].stopped_at < row.stopped_at) {
    result[row.activity.id].stopped_at = row.stopped_at
  }
  return result
}, [])`
  }
  scope.customMergeCode(scope.customMergeCodeExamples.groupByActivity)
  scope.updateMergeCode = function (code) {
    scope.customMergeCode(code)
    prepareCollection(scope)
  }
  prepareCollection(scope)
  Promise.all([
    customerApi.getCollection(),
    projectApi.getCollection(),
    serviceApi.getCollection(),
    tagApi.getCollection()
  ]).then(function ([customers, projects, services, tags]) {
    const filter = getFilterOptions(customers, projects, services, tags)
    const fetch = onFetch(customers, projects, services, tags)
    scope.onSubmitFilter = function (query) {
      fetch(scope, filter(query))
    }
    debug('Registered filter submit event')
    scope.onSubmitFilter(scope.query)
  })

  return scope
}

function view (scope) {
  const rows = scope.rows()
  debug('rendering list', rows.map(row => row.duration))
  return m('.report', [
    m('.query.filter', cardView(m.component(shellFilter, scope))),
    m('.query.merger', cardView(m.component(shellMerger, {
      current: scope.customMergeCode,
      examples: scope.customMergeCodeExamples,
      update: scope.updateMergeCode
    }))),
    m('.table-responsive',
      m('table.table', [
        headerView(scope.columns()),
        m('tbody',
          rows.map((row) => itemView({ item: row, key: row.id, columns: scope.columns() }))
        ),
        totalsView({ rows: rows, columns: scope.columns() })
      ])
    )
  ])
}

module.exports = { controller, getFilterOptions, view, prepareCollection }
