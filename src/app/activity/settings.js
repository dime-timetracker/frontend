'use strict'

const statisticsInput = require('./statisticsInput')
const t = require('src/lib/translation')

module.exports = {
  'activity.display.defaultFilter': { type: 'text', value: '' },
  'activity.display.showIncome': { type: 'checkbox', value: false },
  'activity.display.showActivityIncome': { type: 'checkbox', value: true },
  'activity.display.incomePrecisionSeconds': { type: 'number', value: 15 * 60 },
  'activity.statistics.items': { input: statisticsInput, value: [
    {
      aggregator: 'timeslices.reduce((result, row) => result + row.duration, 0)',
      filter: 'current month',
      formatValue: '"" + (Math.round(value/360)/10) + " h"',
      label: t('statistics.currentMonth'),
      target: 120 * 3600
    }
  ]}
}
