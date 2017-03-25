'use strict'

const groupBy = require('lodash/groupBy')
const m = require('src/lib/mithril')
const sortBy = require('lodash/sortBy')

const addButton = require('./addButton')
const api = require('../../api/project')
const customerApi = require('../../api/customer')
const item = require('./item')
const t = require('../../lib/translation')

function controller () {
  const scope = {
    collection: []
  }
  api.getCollection().then((projects) => {
    customerApi.fetchAll().then((customers) => {
      scope.collection = sortBy(projects, (project) => project.name).map((project) => {
        project.customer = customers.find((customer) => customer.id === project.customer_id)
        return project
      })
      m.redraw()
    })
  })

  scope.add = (newProject) => {
    api.persist(newProject).then((project) => {
      scope.collection.unshift(project)
      m.redraw()
    })
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
      (projects[status] && projects[status].length) ? m('.row', projects[status].map((project) => {
        return m.component(item, {
          collection: scope.collection,
          enabled: status === 'enabled',
          key: 'project-' + project.id,
          project: project
        })
      })) : m('p', t('project.list.' + status + '.empty'))
    ])),
    m.component(addButton, { add: scope.add })
  ])
}

module.exports = { controller, view }
