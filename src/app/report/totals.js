'use strict'

const m = require('src/lib/mithril')
const moment = require('moment')
const t = require('src/lib/translation')

function view (scope) {
  const total = scope.rows.reduce((sum, row) => { return sum + row.duration }, 0)
  return m('tr.total', [
    m('th', { colspan: scope.columns.length - 1 }, t('report.table.totals.duration')),
    m('td.duration.total', moment.duration(total, 'seconds').asHours().toFixed(2) + ' h')
  ])
}

module.exports = { view }
