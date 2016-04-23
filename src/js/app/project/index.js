'use strict'

const groupBy = require('lodash/collection/groupBy')
const m = require('mithril')
const map = require('lodash/collection/map')
const sortBy = require('lodash/collection/sortBy')

const api = require('../../api/project')
const customerApi = require('../../api/customer')
const item = require('./item')
const t = require('../../lib/translation')

function controller () {
  const scope = {
    collection: []
  }
  api.fetchAll().then((projects) => {
    customerApi.fetchAll().then((customers) => {
      scope.collection = sortBy(projects, (project) => project.name).map((project) => {
        project.customer = customers.find((customer) => customer.id === project.customer_id)
        return project
      })
    })
  })

  scope.add = (e) => {
    if (e) {
      e.preventDefault()
    }
    api.persist({})
  }

  return scope
};

function view (scope) {
  const projects = groupBy(scope.collection, (project) => {
    return project.enabled ? 'enabled' : 'disabled'
  })
  return m('.projects', [
    m('h2', t('projects')),
    ['enabled', 'disabled'].map((status) => m('.' + status, [
      m('h3.content-sub-heading', t('project.list.' + status + '.headline')),
      projects[status].length ? m('.row', projects[status].map((project) => {
        return m.component(item, {
          key: 'project-' + project.id,
          project: project,
          collection: scope.collection
        })
      })) : m('p', t('project.list.' + status + '.empty'))
    ]))
  ])
};

module.exports = { controller, view }
