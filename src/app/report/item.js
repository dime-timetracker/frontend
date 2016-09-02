'use strict'

const m = require('src/lib/mithril')
const moment = require('moment')
const userSettings = require('src/app/setting').sections

function view (scope) {
  const item = scope.item
  const columns = scope.columns
  return m('tr.timeslice', { key: scope.key }, columns.map(col => {
    let value
    if (col === 'tags') {
      // activity tags were broken down to row
      const shortcut = userSettings.find('global.shortcuts.tag')
      value = item.tags.map(tag => tag ? shortcut + tag.name : null).join(' ')
    } else if (item.activity[col]) {
      value = item.activity[col].name || item.activity[col]
    } else {
      if (col === 'duration') {
        value = moment.duration(item.duration, 'seconds').asHours().toFixed(2) + ' h'
      } else {
        value = item[col]
      }
    }
    if (undefined === value) {
      value = ''
    }
    return m('td.' + col, value)
  }))
}

module.exports = { view }
