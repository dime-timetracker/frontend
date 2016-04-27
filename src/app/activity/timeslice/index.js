'use strict'

const m = require('src/lib/mithril')
const timesliceItem = require('./item')

function controller (args) {
  const scope = {
    items: args.activity.timeslices
  }

  scope.add = function (e) {
    if (e) {
      e.preventDefault()
    }
    args.activity.addTimeslice()
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
