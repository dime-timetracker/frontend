'use strict'

const m = require('src/lib/mithril')
const moment = require('moment')
const t = require('src/lib/translation')
const nbsp = '\u00a0'

function view (scope) {
  const total = scope.rows.reduce((sum, row) => sum + row.duration, 0)
  const priceEnabled = (scope.columns.indexOf('price') > -1)
  return m('tr.total', [
    m('th', { colspan: scope.columns.length - (priceEnabled ? 2 : 1) }, t('report.table.totals.duration')),
    m('td.duration.total', moment.duration(total, 'seconds').asHours().toFixed(2) + nbsp + 'h'),
    priceEnabled ? m('td.price.total', scope.rows.reduce((sum, row) => sum + row.price, 0).toFixed(2) + nbsp + '€') : null
  ])
}

module.exports = { view }
