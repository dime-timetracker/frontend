'use strict'

const m = require('src/lib/mithril')
const t = require('../../lib/translation')
const headerWithDescription = require('./headerWithDescription')
const userSettings = m.prop([])

const debug = require('debug')('app.setting')

const cardView = require('../utils/views/card/default')

const fields = {
  input: require('../utils/views/formfields/input'),
  select: require('../utils/views/formfields/select'),
  checkbox: require('../utils/views/formfields/checkbox')
}

const sections = {
  global: {
    'global.header.name': { type: 'text', value: 'Dime Timetracker' },
    'global.header.icon': { type: 'text', value: 'icon-access-time' },
    'global.header.color': { type: 'text', value: 'green' },
    'global.shortcuts.customer': { type: 'text', value: '@' },
    'global.shortcuts.project': { type: 'text', value: '/' },
    'global.shortcuts.service': { type: 'text', value: ':' },
    'global.timestamp.format': { type: 'text', value: 'X' }
  }
}
sections.find = (name) => {
  let result
  Object.keys(sections).map((sectionName) => {
    if (sections[sectionName][name]) {
      result = sections[sectionName][name].value
    }
  })
  return result
}

function controller () {
  const api = require('../../api/setting')
  const scope = {
    settings: {},
    change: (name) => {
      debug('Register change event for ' + name)
      return (value) => {
        debug('change ' + name + ' to ' + value)
        scope.settings[name] = value
        api.persistConfig(name, value)
      }
    }
  }
  api.fetchAll().then((settings) => {
    settings.map((setting) => {
      let name = setting.name
      scope.settings[name] = setting.value
    })
  })
  return scope
}

function view (scope) {
  return m('.settings', Object.keys(sections).map((sectionName) => {
    const itemNames = Object.keys(sections[sectionName])
    return itemNames.length ? m('.section', [
      m('h2.content-sub-heading', headerWithDescription(sectionName)),
      cardView(itemNames.map((name) => {
        const setting = sections[sectionName][name]
        setting.name = name
        if (scope.change) {
          setting.change = scope.change(name)
        }
        const input = fields[setting.type] || fields['input']
        return m('.item', [
          m('label[for="' + name + '"]', t('config.' + name + '.title')),
          input(setting, scope.settings[name])
        ])
      }))
    ]) : null
  }))
}

module.exports = {
  userSettings: userSettings,
  sections: sections,
  controller: controller,
  view: view
}
