'use strict'

const m = require('mithril')
const t = require('../../lib/translation')
const duration = require('../utils/views/duration')

function controller (context) {
  var scope = {
    activity: context.activity,
    totalDuration: context.totalDuration,
    running: context.running
  }

  scope.action = function (e) {
    if (e) {
      e.preventDefault()
    }
    if (context.running) {
      context.stop(scope.activity)
    } else {
      context.start(scope.activity)
    }
  }

  return scope
};

function view (scope) {
  var icon = scope.running ? '.icon.icon-stop' : '.icon.icon-play-arrow'
  var color = scope.running ? '.orange-text' : ''
  var title = scope.running ? 'Stop activity' : 'Start activity'

  var content = [
    m('span' + icon),
    ' ',
    duration(scope.totalDuration)
  ]

  return m('a.btn.btn-flat' + color, { title: t(title), onclick: scope.action }, content)
};

module.exports = {
  controller: controller,
  view: view
}
