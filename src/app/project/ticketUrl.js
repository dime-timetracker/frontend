'use strict'

const api = require('../../api/setting')
const input = require('../utils/views/formfields/input')
const m = require('src/lib/mithril')
const t = require('../../lib/translation')
const userSettings = require('../setting').sections

const settingName = 'projects.ticketLinks'

const links = () => JSON.parse(userSettings.find(settingName) || '{}')

function ticketLink (projectAlias) {
  const link = {}
  if (links()[projectAlias]) {
    link.pattern = links()[projectAlias].pattern
    link.url = links()[projectAlias].url
  }

  return link
}

function linkTags (activity) {
  const link = activity.project ? ticketLink(activity.project.alias) : {}

  return activity.tags.map(tag => {
    if (link.pattern && link.url) {
      const matches = tag.name.match(new RegExp(link.pattern))
      if (matches) {
        tag.url = link.url.replace('%ticket%', matches[matches.length - 1])
      }
    }
    return tag
  })
}

function controller (projectScope) {
  const projectAlias = projectScope.project.alias
  const scope = ticketLink(projectAlias)

  scope.editing = !!(scope.pattern || scope.url)

  scope.change = () => {
    const updatedLinks = links()
    updatedLinks[projectAlias] = links()[projectAlias] || {}
    updatedLinks[projectAlias].pattern = scope.pattern
    updatedLinks[projectAlias].url = scope.url
    return api.persistConfig(settingName, JSON.stringify(updatedLinks))
  }

  return scope
}

function view (scope) {
  if (scope.editing) {
    return m('.edit.property.ticketLink', [
      m('.help', t('project.property.ticketLink.help')),
      m('.form-row', m('.form-element', [
        m('label', [
          t('project.property.ticketPattern'),
          m('.value', [
            input({
              name: 'ticketPattern',
              change: (pattern) => {
                scope.pattern = pattern
                scope.change()
              }
            }, scope.pattern || '')
          ])
        ])
      ])),
      m('.form-row', m('.form-element', [
        m('label', [
          t('project.property.ticketUrl'),
          m('.value', [
            input({
              name: 'ticketUrl',
              change: (url) => {
                scope.url = url
                scope.change()
              }
            }, scope.url || '')
          ])
        ])
      ]))
    ])
  }
  return m('a[href=""]', {
    onclick: () => {
      scope.editing = true
      return false
    }
  }, t('project.ticketLink.configure'))
}

module.exports = { controller, linkTags, view }
