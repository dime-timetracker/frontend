'use strict'

const m = require('src/lib/mithril')
const t = require('src/lib/translation')

const duration = require('src/app/utils/views/duration')
const getDuration = require('src/app/timeslice').duration
const getEnd = require('src/app/timeslice').getEnd
const getStart = require('src/app/timeslice').getStart
const input = require('src/app/utils/views/formfields/input')
const running = require('src/app/timeslice').running
const setEndDate = require('src/app/timeslice').setEndDate
const setEndTime = require('src/app/timeslice').setEndTime
const setStartDate = require('src/app/timeslice').setStartDate
const setStartTime = require('src/app/timeslice').setStartTime
const tile = require('src/app/utils/views/tile')
const timesliceApi = require('src/api/timeslice')

function controller (listContext) {
  const scope = {
    activity: listContext.activity,
    changed: false,
    formatDuration: () => duration(getDuration(listContext.timeslice)),
    formatEnd: (format = undefined) => getEnd(listContext.timeslice).format(format),
    formatStart: (format = undefined) => getStart(listContext.timeslice).format(format),
    isRunning: () => running(listContext.timeslice),
    timeslice: listContext.timeslice
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
    var question = t('timeslice.remove.confirm', { duration: getDuration(listContext.timeslice) })
    if (global.window.confirm(question)) {
      timesliceApi.remove(scope.timeslice).then(() => {
        scope.activity().timeslices.forEach((timeslice, key) => {
          if (timeslice.id === scope.timeslice.id) {
            delete scope.activity().timeslices[key]
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
    m('label.start', [
      m('.label', t('timeslice.property.started_at')),
      input({
        type: 'date',
        inline: true,
        name: 'start-date',
        placeholder: 'YYYY-MM-DD',
        value: scope.formatStart('YYYY-MM-DD'),
        change: function (value) {
          setStartDate(scope.timeslice, value)
          scope.changed = true
        }
      }),
      input({
        type: 'time',
        inline: true,
        name: 'start-time',
        placeholder: 'HH:mm:ss',
        value: scope.formatStart('HH:mm:ss'),
        change: function (value) {
          setStartTime(scope.timeslice, value)
          scope.changed = true
        }
      })
    ]),
    m('label.end', [
      m('.label', t('timeslice.property.stopped_at')),
      input({
        type: 'date',
        inline: true,
        name: 'end-date',
        placeholder: 'YYYY-MM-DD',
        value: !scope.isRunning() ? scope.formatEnd('YYYY-MM-DD') : '',
        change: function (value) {
          setEndDate(scope.timeslice, value)
          scope.changed = true
        }
      }),
      input({
        type: 'time',
        inline: true,
        name: 'end-time',
        placeholder: 'HH:mm:ss',
        value: !scope.isRunning() ? scope.formatEnd('HH:mm:ss') : '',
        change: function (value) {
          setEndTime(scope.timeslice, value)
          scope.changed = true
        }
      })
    ])
  ]

  const actions = [
    m('a.duration', scope.formatDuration()),
    m('a.btn.btn-flat[href=#]', {
      onclick: scope.remove,
      title: t('timeslice.remove.title')
    }, m('span.icon.icon-delete'))
  ]
  if (scope.changed) {
    actions.push(m('a.btn.btn-green[href=#]', { onclick: scope.save }, m('span.icon.icon-done')))
  }

  return tile(inner, { actions: actions })
}

module.exports = { controller, view }
