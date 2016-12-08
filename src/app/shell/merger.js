'use strict'

const base64 = require('src/lib/base64')
const codemirror = require('src/lib/codemirror')
const debug = require('debug')('app.shell.merger')
const m = require('src/lib/mithril')
const shell = require('../shell')
const t = require('src/lib/translation')
const toggleButton = require('../utils/components/toggleButton')

const nbsp = '\u00A0'

const methods = (userSettings, settingsApi, exampleMergers) => {
  const mergers = m.prop()
  function get () {
    const setting = JSON.parse(userSettings.find('report.customMergers') || '[]')
    return mergers(setting.reduce((result, merger) => {
      result[merger.name] = base64.decode(merger.code)
      return result
    }, exampleMergers || {}))
  }
  function persist () {
    const mergersJson = JSON.stringify(Object.keys(mergers()).reduce((result, name) => {
      result.push({ name: name, code: base64.encode(mergers()[name]) })
      return result
    }, []))
    return settingsApi.persistConfig('report.customMergers', mergersJson)
  }
  function add (name, code) {
    const mergersObj = get()
    mergersObj[name] = code
    mergers(mergersObj)
    return persist()
  }
  function update (oldName, newName, newCode) {
    const mergersObj = get()
    mergersObj[newName] = newCode || mergersObj[oldName]
    delete mergersObj[oldName]
    mergers(mergersObj)
    return persist()
  }
  function remove (name) {
    const mergersObj = get()
    delete mergersObj[name]
    mergers(mergersObj)
    return persist()
  }
  return { get, add, update, remove }
}

function examplesView (scope) {
  if (Object.keys(scope.examples()).length) {
    const options = Object.keys(scope.examples())
    options.unshift(t('shell.merger.example.none')) // prepend empty option
    return m('.examples.column', m('select.form-control', {
      onchange: (e) => {
        scope.name = e.target.value
        scope.origName = e.target.value
        scope.query(scope.examples()[e.target.value] || 'rows')
        scope.update(scope.examples()[e.target.value] || 'rows')
        codemirror.reload(scope.query())
        if (e.target.value === t('shell.merger.example.none')) {
          scope.origName = e.target.value
          scope.showDetails = true
        }
      }
    }, options.map(name => {
      return m('option[value=' + name + ']', {
        selected: name === scope.name
      }, name)
    })))
  }
}

function inputView (scope) {
  const BR = "\n"
  const buttons = []
  const code = scope.query()
  if (scope.name !== t('shell.merger.example.none') && code && code.trim().length) {
    const isCustom = (scope.origName &&
      scope.origName !== t('shell.merger.example.none') &&
      scope.origName !== t('shell.merger.example.groupByActivity')
    )
    if (isCustom) {
      buttons.push(m('button.btn.blue', {
        onclick: (e) => {
          scope.methods.update(scope.origName, scope.name, scope.query())
          scope.showDetails = false
          m.redraw()
        }
      }, t('shell.merger.button.update.label')))
      buttons.push(m('button.btn.red', {
        onclick: (e) => {
          scope.methods.remove(scope.origName)
          scope.showDetails = false
          m.redraw()
        }
      }, t('shell.merger.button.delete.label')))
    }
    buttons.push(m('button.btn.green', {
      onclick: (e) => {
        scope.methods.add(scope.name, scope.query())
        scope.showDetails = false
        m.redraw()
      }
    }, t('shell.merger.button.create.label')))
  }
  const codebox = m('.codebox', [
    m('pre.code-context-before', 'let rows = [' + BR + '    {activity:{description:""},customer:{name:""},project:{name:""},service:{name:""},tags:[{name:""}],duration:3600},' + BR + '    …' + BR + ']'),
    m('label#codename', [
      t('shell.merger.codename.label'),
      m('input', {
        onchange: e => { scope.name = e.target.value },
        value: scope.name || ''
      }),
      buttons
    ]),
    m.component(codemirror, {
      onchange: (instance, object) => {
        const newMergeCode = instance.doc.getValue()
        debug('replacing merge code: ', newMergeCode)
        scope.update(newMergeCode)
      },
      value: scope.query
    })
  ])
  return m('.mergebox', [
    m('.mergebox-head tile', [
      m('.buttons.tile-action', [
        m.component(toggleButton, {
          iconName: '.icon-keyboard-arrow-down',
          alternateIconName: '.icon-keyboard-arrow-up',
          title: t('shell.merger.codebox.show'),
          alternateTitle: t('shell.merger.codebox.hide'),
          currentState: () => { return scope.showDetails },
          changeState: (state) => {
            scope.origName = scope.name
            scope.showDetails = state
          }
        })
      ]),
      m('.tile-inner', [
        m('.title', t('shell.merger.title')),
        m('.description.pull-left', t('shell.merger.description') + nbsp),
        examplesView(scope)
      ])
    ]),
    scope.showDetails ? codebox : null
  ])
}

function controller (reportScope) {
  const scope = {
    htmlId: 'merger',
    icon: 'icon-new-releases',
    inputView: inputView,
    methods: methods(reportScope.userSettings, reportScope.settingsApi, reportScope.exampleMergers),
    name: reportScope.currentName,
    query: reportScope.current,
    showDetails: false,
    update: reportScope.update
  }
  scope.examples = scope.methods.get
  scope.onSubmit = (e) => { reportScope.update(scope.query()) }
  scope.blur = (e) => { shell.blur(e, scope) }
  scope.focus = (e) => { shell.focus(e, scope) }
  scope.inputView = () => {
    return inputView(scope)
  }

  return scope
}

function view (scope) {
  return m.component(shell, scope)
}

module.exports = { controller, examplesView, inputView, view, methods }
