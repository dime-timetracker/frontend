'use strict'

const activityApi = require('src/api/activity')
const cardView = require('src/app/utils/views/card/default')
const customerApi = require('src/api/customer')
const m = require('src/lib/mithril')
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

function controller () {
  const scope = {
    collection: [],
    query: decodeURIComponent((m.route.param('query') + '').replace(/\+/g, '%20'))
  }
  const options = { filter: scope.query }
  Promise.all([
    activityApi.fetchAll(options),
    customerApi.getCollection(),
    projectApi.getCollection(),
    serviceApi.getCollection(),
    timesliceApi.fetchAll(options)
  ]).then(function ([activities, customers, projects, services, timeslices]) {
    scope.collection = timeslices.map((timeslice) => {
      const activity = activities.find((activity) => (activity.id === timeslice.activity_id))
      if (activity) {
        timeslice.activity = activity
        timeslice.activity.customer = customers.find((customer) => (customer.id === timeslice.activity.customer_id))
        timeslice.activity.project = projects.find((project) => (project.id === timeslice.activity.project_id))
        timeslice.activity.service = services.find((service) => (service.id === timeslice.activity.service_id))
        return timeslice
      }
    })
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

module.exports = {
  controller: controller,
  view: view
}
