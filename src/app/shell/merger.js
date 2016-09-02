'use strict'

const codemirror = require('src/lib/codemirror')
const debug = require('debug')('app.shell.merger')
const m = require('src/lib/mithril')
const shell = require('../shell')
const t = require('src/lib/translation')
const toggleButton = require('../utils/components/toggleButton')

const nbsp = '\u00A0'

function examplesView (scope) {
  if (Object.keys(scope.examples).length) {
    const options = Object.keys(scope.examples)
    options.unshift('none') // prepend empty option
    return m('.examples.column', m('select', {
      onchange: (e) => {
        scope.query(scope.examples[e.target.value] || 'rows')
        codemirror.reload(scope.query())
        if (e.target.value === 'none') {
          scope.showDetails = true
        }
      }
    }, options.map(key => {
      return m('option[value=' + key + ']', {
        selected: (scope.examples[key] || 'rows').trim() === scope.query().trim()
      }, t('shell.merger.example.' + key))
    })))
  }
}

function inputView (scope) {
  const codebox = m('.codebox', [
    m('pre.code-context-before', 'let rows = [' + "\n" + '    {activity:{description:""},customer:{name:""},project:{name:""},service:{name:""},tags:[{name:""}],duration:3600},' + "\n" + '    …' + "\n" + ']'),
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
          changeState: (state) => { scope.showDetails = state }
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
    inputView: inputView,
    icon: 'icon-new-releases',
    htmlId: 'merger',
    query: reportScope.current,
    examples: reportScope.examples,
    showDetails: false,
    update: reportScope.update
  }
  scope.onSubmit = (e) => { reportScope.update(scope.query) }
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

module.exports = { controller, examplesView, view }
