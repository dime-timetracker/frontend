'use strict'

const m = require('src/lib/mithril')
const moment = require('moment')
const userSettings = require('src/app/setting').sections

function values (columns, item) {
  const durationHours = moment.duration(item.duration, 'seconds').asHours()
  item.price = durationHours * item.activity.project.rate
  return columns.map(col => {
    let value
    let valueSource = ''
    if (col === 'tags') {
      // activity tags were broken down to row
      const shortcut = userSettings.find('global.shortcuts.tag')
      value = item.tags.map(tag => tag ? shortcut + tag.name : null).join(' ')
    } else if (item.activity[col]) {
      value = item.activity[col].name
      valueSource = 'name'
      if (!value) {
        value = item.activity[col].alias
        if (value) {
          const shortcut = userSettings.find('global.shortcuts.' + col)
          value = shortcut + value
          valueSource = 'alias'
        }
      }
      if (!value) {
        value = item.activity[col]
        valueSource = 'property'
      }
    } else {
      switch (col) {
        case 'duration':
          value = durationHours.toFixed(2) + ' h'
          break
        case 'price':
          value = item.price.toFixed(2) + ' €'
          break
        default:
          value = item[col]
      }
    }
    if (undefined === value) {
      value = ''
    }
    return {
      code: col,
      type: valueSource,
      value: value
    }
  })
}

function view (scope) {
  return m('tr.timeslice', { key: scope.key },
    values(scope.columns, scope.item).map(col => m('td.' + col.code + '.' + col.type, col.value))
  )
}

module.exports = { view, values }
