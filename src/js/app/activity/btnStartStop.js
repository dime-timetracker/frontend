'use strict'

var m = require('mithril')
var t = require('../../lib/translation')
var duration = require('../utils/views/duration')
var running = require('./index').running
var totalDuration = require('./index').totalDuration
var start = require('./index').start
var stop = require('./index').stop

function controller (context) {
  var scope = {
    activity: context.activity,
    totalDuration: totalDuration(context.activity)
  }

  scope.action = function (e) {
    if (e) {
      e.preventDefault()
    }
    if (running(scope.activity)) {
      stop(scope.activity)
    } else {
      start(scope.activity)
    }
  }

  return scope
};

function view (scope) {
  var runs = running(scope.activity)
  var icon = runs ? '.icon.icon-stop' : '.icon.icon-play-arrow'
  var color = runs ? '.orange-text' : ''
  var title = runs ? 'Stop activity' : 'Start activity'

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
