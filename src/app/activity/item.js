'use strict'

const m = require('src/lib/mithril')
const t = require('../../lib/translation')

const activityApi = require('../../api/activity')
const activityForm = require('./form')
const arrayRemove = require('lodash/remove')
const btnStartStop = require('./btnStartStop')
const grid = require('../utils/views/grid')
const settingsApi = require('../../api/setting')
const tagApi = require('../../api/tag')
const ticketUrl = require('src/app/project/ticketUrl')
const tile = require('../utils/views/tile')
const timesliceList = require('./timeslice/')
const toggleButton = require('../utils/components/toggleButton')

const relationForms = {
  customer: require('src/app/customer/item'),
  project: require('src/app/project/item'),
  service: require('src/app/service/item')
}

function submit (context) {
  /**
   * @var context {
   *    object activity    Activity to be submitted
   *    object activityApi Activity API client
   *    array  tags        Array of existing tags
   *    object tagApi      Tag API client
   * }
   */
  function persistActivity (resolve, reject) {
    context.activity.tags = (context.activity.tags || []).map(tag => tag.id)
    return context.activityApi.persist(context.activity).then(resolve, reject)
  }
  if ((context.activity.tags || []).length) {
    return Promise.all((context.activity.tags || []).map(tag => {
      const existingTag = tag.id ? tag : context.tags.find(existingTag => existingTag.name === tag.name)
      if (existingTag) {
        tag.id = existingTag.id
        return new Promise((resolve) => resolve())
      } else {
        return context.tagApi.persist(tag).then(savedTag => {
          tag.id = savedTag.id
          context.tags.push(tag)
        })
      }
    })).then(persistActivity)
  } else {
    return new Promise(persistActivity)
  }
}

function controller (activityScope) {
  const scope = {
    activity: m.prop(activityScope.activity),
    customers: activityScope.customers,
    projects: activityScope.projects,
    services: activityScope.services,
    tags: activityScope.tags,
    relationForm: null,
    running: activityScope.running,
    totalDuration: activityScope.totalDuration,
    start: activityScope.start,
    stop: activityScope.stop,
    showDetails: activityScope.activity.description === undefined || false,
    shortcuts: {
      'customer': settingsApi.find('global.shortcuts.customer'),
      'project': settingsApi.find('global.shortcuts.project'),
      'service': settingsApi.find('global.shortcuts.service'),
      'tag': settingsApi.find('global.shortcuts.tag')
    }
  }

  scope.onSubmit = (e) => {
    if (e) {
      e.preventDefault()
    }
    submit({
      activity: scope.activity(),
      activityApi: activityApi,
      tags: activityScope.tags,
      tagApi: tagApi
    }).then((activity) => {
      scope.activity(activity)
      m.redraw()
    })
  }
  scope.onDelete = (e) => {
    if (e) {
      e.preventDefault()
    }
    const question = t('activity.remove.confirm', { description: scope.activity().description })
    if (global.window.confirm(question)) {
      activityApi.remove(scope.activity())
      arrayRemove(activityScope.collection, (item) => {
        return item.id === scope.activity().id
      })
    }
  }

  return scope
}

function view (scope) {
  const options = {
    active: scope.showDetails,
    attributes: {},
    actions: [],
    subs: []
  }
  if (scope.running(scope.activity())) {
    options.attributes.class = 'running'
  }
  options.actions.push(m.component(btnStartStop, {
    key: 'startstop-' + scope.activity().id,
    activity: scope.activity,
    running: scope.running,
    totalDuration: scope.totalDuration,
    start: scope.start,
    stop: scope.stop
  }))

  options.actions.push(m.component(toggleButton, {
    iconName: '.icon-keyboard-arrow-down',
    alternateIconName: '.icon-keyboard-arrow-up',
    title: t('activity.details.show'),
    alternateTitle: t('activity.details.hide'),
    currentState: () => { return scope.showDetails },
    changeState: (state) => { scope.showDetails = state }
  }))

  if (scope.showDetails) {
    options.subs.push(grid(
      [
        m.component(activityForm, {
          activity: scope.activity,
          onSubmit: scope.onSubmit,
          onDelete: scope.onDelete,
          customers: scope.customers,
          projects: scope.projects,
          services: scope.services,
          tags: scope.tags,
          shortcuts: scope.shortcuts
        }),
        m('a.btn.btn-flat[href=#]', {
          onclick: scope.onDelete,
          title: t('activity.remove.title')
        }, m('span.icon.icon-delete'))
      ],
      m.component(timesliceList, {
        key: 'timeslices-' + scope.activity().id,
        activity: scope.activity
      })
    ))
  }

  const inner = []
  inner.push(m('span', scope.activity().description));
  ['customer', 'project', 'service'].forEach((relation) => {
    if (scope.activity()[relation]) {
      let relationForm = null
      if (scope.relationForm === relation) {
        const context = { key: (scope.activity().id || 0) + '.' + relation }
        context[relation] = scope.activity()[relation]
        relationForm = m('span.embedded-form.' + relation, [
          m.component(relationForms[relation], context),
          m('button.close', { onclick: (e) => { scope.relationForm = null } }, '×')
        ])
      }
      inner.push(m('span.badge', {
        title: scope.activity()[relation].name
      }, [
        relationForm,
        m('a.alias[href=#]', {
          onclick: (e) => {
            scope.relationForm = scope.relationForm === relation ? null : relation
            return false
          }
        }, scope.shortcuts[relation] + scope.activity()[relation].alias)
      ]))
    }
  })
  ticketUrl.linkTags(scope.activity()).forEach(tag => {
    let tagOut = '' + scope.shortcuts.tag + tag.name
    if (tag.url) {
      tagOut = m('a', {
        href: tag.url,
        rel: 'noopener',
        target: '_blank'
      }, tagOut)
    }
    inner.push(m('span.badge.tag', tagOut))
  })

  return tile(inner, options)
}

module.exports = {
  controller: controller,
  view: view,
  submit: submit
}
