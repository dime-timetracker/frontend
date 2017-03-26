'use strict'

const m = require('src/lib/mithril')
const moment = require('moment')
const userSettings = require('src/app/setting').sections
const nbsp = '\u00a0'

function values (columns, item) {
  const durationHours = moment.duration(item.duration, 'seconds').asHours()
  item.price = (item.activity.project) ? durationHours * item.activity.project.rate : 0
  return columns.map(col => {
    let title
    let value
    let valueSource = ''
    if (col === 'tags') {
      // activity tags were broken down to row
      const shortcut = userSettings.find('global.shortcuts.tag')
      value = (item.tags || []).map(tag => tag ? shortcut + tag.name : null).join(' ')
    } else if (item.activity[col]) {
      const shortcut = userSettings.find('global.shortcuts.' + col)
      title = shortcut + item.activity[col].alias || ''
      value = item.activity[col].name
      valueSource = 'name'
      if (!value) {
        value = item.activity[col].alias
        if (value) {
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
          value = durationHours.toFixed(2) + nbsp + 'h'
          break
        case 'price':
          value = item.price.toFixed(2) + nbsp + '€'
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
      title: title,
      type: valueSource,
      value: value
    }
  })
}

function view (scope) {
  return m('tr.timeslice', { key: scope.key },
    values(scope.columns, scope.item).map(col => m('td.' + col.code + '.' + col.type, {
      title: col.title
    }, col.value))
  )
}

module.exports = { view, values }
