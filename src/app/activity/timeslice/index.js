'use strict'

const m = require('src/lib/mithril')
const sortBy = require('lodash/collection/sortBy')
const timesliceItem = require('./item')

function controller (activityScope) {
  const scope = {
    activity: activityScope.activity,
    items: sortBy(activityScope.activity.timeslices, (timeslice) => timeslice.stopped_at || timeslice.stopped_at).reverse()
  }

  scope.add = function (e) {
    if (e) {
      e.preventDefault()
    }
    scope.activity.addTimeslice()
  }

  return scope
}

function view (scope) {
  return m('.timeslices.tile-wrap', m('tiles', scope.items.map((timeslice) => m.component(timesliceItem, {
    key: timeslice.uuid,
    activity: scope.activity,
    timeslice: timeslice
  }))))
}

module.exports = { controller, view }
