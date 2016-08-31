'use strict'

const m = require('src/lib/mithril')
const moment = require('moment')

function controller (context) {
  return { item: context.item }
}

function view (scope) {
  const item = scope.item
  return m('tr.timeslice', [
    m('td.activity.description', item.activity.description),
    m('td.activity.customer', item.activity.customer ? item.activity.customer.name : ''),
    m('td.activity.project', item.activity.project ? item.activity.project.name : ''),
    m('td.activity.service', item.activity.service ? item.activity.service.name : ''),
//    m('td.startedAt', item.started_at),
//    m('td.stoppedAt', item.stopped_at),
    m('td.duration.text-right', moment.duration(item.duration, 'seconds').asHours().toFixed(2) + ' h')
  ])
}

module.exports = { controller, view }
