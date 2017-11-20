'use strict'

const getFilterOptions = require('src/app/report').getFilterOptions
const fetchReport = require('src/app/report/fetch')
const m = require('src/lib/mithril')
const t = require('src/lib/translation')
const userSettings = require('src/app/setting').sections

function controller (listScope) {
  const scope = {
    metrics: JSON.parse(userSettings.find('activity.statistics.items') || '[]')
  }
  scope.getFilterOptions = getFilterOptions(
    listScope.customers,
    listScope.projects,
    listScope.services,
    listScope.tags
  )

  const report = fetchReport({
    customer: listScope.customers,
    project: listScope.projects,
    service: listScope.services,
    tag: listScope.tags
  })

  scope.metrics.forEach(metric => {
    report(timeslices => {
      const result = eval(metric.aggregator)
      metric.value = result
      m.redraw()
    }, scope.getFilterOptions(metric.filter))
  })

  return scope
}

function loading () {
  return m('.loading', t('activity.statistics.loading'))
}

function view (scope) {
  if (!scope.getFilterOptions) {
    return loading()
  }

  return m('.statistics', Object.keys(scope.metrics).map(metricName => {
    const metric = scope.metrics[metricName]
    const percent = metric.value === undefined ? null : Math.round(metric.value * 100 / metric.target)
    let value = metric.target
    const formattedTarget = eval(metric.formatValue)
    value = metric.value
    return m('.' + metricName, [
      m('.statistic.' + metricName, [
        value === undefined ? null : m('.target', [
          m('.current', { style: { width: percent + '%' } })
        ]),
        m('.statistics-label', [
          m('span.name', metric.label + ':'),
          m('span.value', eval(metric.formatValue) + '/' + formattedTarget)
        ])
      ])
    ])
  }))
}

module.exports = { controller, view }
