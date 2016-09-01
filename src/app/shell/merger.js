'use strict'

const codemirror = require('src/lib/codemirror')
const m = require('src/lib/mithril')
const shell = require('../shell')
const t = require('src/lib/translation')

function examplesView (scope) {
  if (Object.keys(scope.examples).length) {
    const options = Object.keys(scope.examples)
    options.unshift('') // prepend empty option
    return m('.examples', m('select', {
      onchange: (e) => {
        scope.query(scope.examples[e.target.value] || '')
        codemirror.reload(scope.query())
      }
    }, options.map(key => {
      return m('option[value=' + key + ']', {
        selected: (scope.examples[key] || '').trim() === scope.query().trim()
      }, t('shell.merger.example.' + (key || 'none')))
    })))
  }
}

function inputView (scope) {
  return m('.javascript', [
    examplesView(scope),
    m.component(codemirror, {
      value: scope.query
    })
  ])
}

function controller (reportScope) {
  const scope = {
    inputView: inputView,
    icon: 'icon-new-releases',
    htmlId: 'merger',
    query: m.prop(reportScope.current),
    examples: reportScope.examples
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
