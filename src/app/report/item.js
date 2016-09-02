'use strict'

const m = require('src/lib/mithril')
const moment = require('moment')
const userSettings = require('src/app/setting').sections

function view (scope) {
  const item = scope.item
  const columns = scope.columns
  return m('tr.timeslice', { key: scope.key }, columns.map(col => {
    let value
    if (item.activity[col]) {
      if (col === 'tags') {
        const shortcut = userSettings.find('global.shortcuts.tag')
        value = item.activity.tags.map(tag => tag ? shortcut + tag.name : null).join(' ')
      } else {
        value = item.activity[col].name || item.activity[col]
      }
    } else {
      if (col === 'duration') {
        value = moment.duration(item.duration, 'seconds').asHours().toFixed(2)
      } else {
        value = item[col]
      }
    }
    return m('td.' + col, value)
  }))
}

module.exports = { view }
