'use strict'

const getFilterOptions = require('src/app/report').getFilterOptions
const fetchReport = require('src/app/report/fetch')
const m = require('src/lib/mithril')
const t = require('src/lib/translation')

function controller (listScope) {
  const scope = {
    metrics: {}
  }
  scope.getFilterOptions = getFilterOptions(
    listScope.customers,
    listScope.projects,
    listScope.services,
    listScope.tags
  )

  scope.metrics.currentMonth = {
    aggregator: 'timeslices.reduce((result, row) => result + row.duration, 0)',
    filter: 'current month',
    formatValue: '"" + (Math.round(value/360)/10) + " h"',
    label: t('statistics.currentMonth'),
    target: 100 * 3600
  }
  const report = fetchReport({
    customer: listScope.customers,
    project: listScope.projects,
    service: listScope.services,
    tag: listScope.tags
  })

  Object.keys(scope.metrics).forEach(metricName => {
    report(timeslices => {
      const result = eval(scope.metrics[metricName].aggregator)
      scope.metrics[metricName].value = result
      m.redraw()
    }, scope.getFilterOptions(scope.metrics[metricName].filter))
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
          m('.current', { style: { width: percent + '%' } }),
          m('span.name', metric.label + ':'),
          m('span.value', eval(metric.formatValue) + '/' + formattedTarget)
        ])
      ])
    ])
  }))
}

module.exports = { controller, view }
