'use strict'

const m = require('src/lib/mithril')
const t = require('src/lib/translation')

const duration = require('src/app/utils/views/duration')
const getDuration = require('src/app/timeslice').duration
const getEnd = require('src/app/timeslice').getEnd
const getStart = require('src/app/timeslice').getStart
const input = require('src/app/utils/views/formfields/input')
const running = require('src/app/timeslice').running
const setEnd = require('src/app/timeslice').setEnd
const setStart = require('src/app/timeslice').setStart
const tile = require('src/app/utils/views/tile')
const timesliceApi = require('src/api/timeslice')

function controller (listContext) {
  var scope = {
    timeslice: listContext.timeslice,
    changed: false,
    formatStart: (format = undefined) => getStart(listContext.timeslice).format(format),
    formatEnd: (format = undefined) => getEnd(listContext.timeslice).format(format),
    formatDuration: () => duration(getDuration(listContext.timeslice)),
    isRunning: () => running(listContext.timeslice)
  }

  scope.save = function (e) {
    if (e) {
      e.preventDefault()
    }
    timesliceApi.persist(scope.timeslice).then(() => {
      scope.changed = false
      m.redraw()
    })
  }

  scope.remove = function (e) {
    if (e) {
      e.preventDefault()
    }
    var question = t('Do you really want to delete "[name]"?', { name: scope.formatDuration() })
    if (global.window.confirm(question)) {
      timesliceApi.remove(scope.timeslice).then(() => {
        scope.activity.timeslices.forEach((timeslice, key) => {
          if (timeslice.id === scope.timeslice.id) {
            delete scope.activity.timeslices[key]
          }
        })
        m.redraw()
      })
    }
  }

  return scope
}

function view (scope) {
  // TODO Updates only when date/time picker available
  const inner = [
    m('span.start', [
      input({
        type: 'datetime-local',
        inline: true,
        name: 'start',
        value: scope.formatStart('YYYY-MM-DDTHH:mm:ss'),
        change: function (value) {
          setStart(scope.timeslice, value)
          if (scope.timeslice.started_at && scope.timeslice.stopped_at) {
            scope.timeslice.duration = null
            scope.timeslice.duration = getDuration(scope.timeslice)
          }
          scope.changed = true
        }
      })
    ]),
    ' - ',
    m('span.end', [
      input({
        type: 'datetime-local',
        inline: true,
        value: !scope.isRunning() ? scope.formatEnd('YYYY-MM-DDTHH:mm:ss') : '',
        change: function (value) {
          setEnd(scope.timeslice, value)
          if (scope.timeslice.started_at && scope.timeslice.stopped_at) {
            scope.timeslice.duration = null
            scope.timeslice.duration = getDuration(scope.timeslice)
          }
          scope.changed = true
        }
      })
    ])
  ]

  const actions = [
    m('a.duration', scope.formatDuration()),
    m('a.btn.btn-flat[href=#]', { onclick: scope.remove }, m('span.icon.icon-delete'))
  ]
  if (scope.changed) {
    actions.push(m('a.btn.btn-green[href=#]', { onclick: scope.save }, m('span.icon.icon-done')))
  }

  return tile(inner, { actions: actions })
}

module.exports = { controller, view }
