'use strict'

const m = require('src/lib/mithril')
const sortBy = require('lodash/sortBy')
const timesliceItem = require('./item')

function controller (activityScope) {
  const scope = {
    activity: activityScope.activity
  }

  return scope
}

function view (scope) {
  const items = sortBy(scope.activity().timeslices.filter(t => t), (timeslice) => timeslice.stopped_at || timeslice.stopped_at).reverse()
  return m('.timeslices.tile-wrap', m('tiles', items.map((timeslice) => m.component(timesliceItem, {
    key: timeslice.uuid || timeslice.id,
    activity: scope.activity,
    timeslice: timeslice
  }))))
}

module.exports = { controller, view }
