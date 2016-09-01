'use strict'

const m = require('src/lib/mithril')
const t = require('../../lib/translation')

const activityApi = require('../../api/activity')
const activityForm = require('./form')
const btnStartStop = require('./btnStartStop')
const grid = require('../utils/views/grid')
const settingsApi = require('../../api/setting')
const tagApi = require('../../api/tag')
const tile = require('../utils/views/tile')
const timesliceList = require('./timeslice/')
const toggleButton = require('../utils/components/toggleButton')

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
    return Promise.all((context.activity.tags || []).filter(tag => !tag.id).map(tag =>
      context.tagApi.persist(tag).then(savedTag => {
        tag.id = savedTag.id
        context.tags.push(tag)
      }
    ))).then(persistActivity)
  } else {
    return new Promise(persistActivity)
  }
}

function controller (activityScope) {
  const scope = {
    activity: activityScope.activity,
    customers: activityScope.customers,
    projects: activityScope.projects,
    services: activityScope.services,
    tags: activityScope.tags,
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
      activity: scope.activity,
      activityApi: activityApi,
      tags: activityScope.tags,
      tagApi: tagApi
    }).then((activity) => {
      scope.activity = activity
      m.redraw()
    })
  }
  scope.onDelete = (e) => {
    if (e) {
      e.preventDefault()
    }
    const question = t('delete.confirm', { activity: scope.activity.description })
    if (global.window.confirm(question)) {
      activityApi.delete(scope.activity)
    }
  }

  return scope
}

function view (scope) {
  const options = {
    active: scope.showDetails,
    actions: [],
    subs: []
  }
  options.actions.push(m.component(btnStartStop, {
    key: 'startstop-' + scope.activity.id,
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
      m.component(timesliceList, {
        key: 'timeslices-' + scope.activity.id,
        activity: scope.activity
      })
    ))
  }

  const inner = []
  inner.push(m('span', scope.activity.description));
  ['customer', 'project', 'service'].forEach((relation) => {
    if (scope.activity[relation]) {
      inner.push(m('span.badge', {
        title: scope.activity[relation].name
      }, scope.shortcuts[relation] + scope.activity[relation].alias))
    }
  })
  scope.activity.tags.forEach(tag => {
    inner.push(m('span.badge.tag', '' + scope.shortcuts.tag + tag.name))
  })

  return tile(inner, options)
}

module.exports = {
  controller: controller,
  view: view,
  submit: submit
}
