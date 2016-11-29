'use strict'

const api = require('../api')

const options = {}
const defaultSettings = require('../app/setting').sections
const userSettings = require('../app/setting').userSettings

function findByName (name) {
  return userSettings().find((setting) => {
    return setting.name === name
  })
}

function fetchAll () {
  return api.fetchBunch('settings', { with: 100000 })
}

function find (name) {
  const setting = findByName(name)
  return setting ? setting.value : defaultSettings.find(name)
}

function persistConfig (name, value) {
  const setting = findByName(name) || { name: name }
  setting.value = value
  return api.persist('settings', setting)
}

function total () {
  if (!options.pagination) {
    fetchAll()
  }
  return options.total
}

module.exports = {
  fetchAll: fetchAll,
  find: find,
  persistConfig: persistConfig,
  total: total
}
