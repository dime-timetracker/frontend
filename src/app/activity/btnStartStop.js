'use strict'

const m = require('src/lib/mithril')
const t = require('../../lib/translation')
const durationView = require('../utils/views/duration')

function runTimer (scope) {
  return (el) => {
    scope.refreshInterval = setInterval(() => {
      scope.duration = scope.getTotalDuration(scope.activity)
      m.render(el, durationView(scope.duration))
    }, 1000)
  }
}

function stopTimer (scope) {
  clearInterval(scope.refreshInterval)
}

function controller (context) {
  const scope = {
    activity: context.activity,
    getTotalDuration: context.totalDuration,
    running: context.running(context.activity),
    duration: context.totalDuration(context.activity)
  }

  if (!scope.running && scope.refreshInterval) {
    stopTimer(scope)
  }

  scope.action = function (e) {
    if (e) {
      e.preventDefault()
    }
    if (context.running(scope.activity)) {
      context.stop(scope.activity)
      scope.running = false
      stopTimer(scope)
    } else {
      context.start(scope.activity)
      scope.running = true
      runTimer(scope)
    }
  }

  return scope
};

function view (scope) {
  const icon = scope.running ? '.icon.icon-stop' : '.icon.icon-play-arrow'
  const color = scope.running ? '.orange-text' : ''
  const config = scope.running ? runTimer(scope) : null
  const title = scope.running ? 'activity.startstopbutton.stop.title' : 'activity.startstopbutton.start.title'

  return m('a.btn.btn-flat' + color, { title: t(title), onclick: scope.action },
    m('span' + icon), ' ', m('span.duration', { config: config }, durationView(scope.duration))
  )
};

module.exports = {
  controller: controller,
  view: view
}
