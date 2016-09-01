'use strict'

const codemirror = require('src/lib/codemirror')
const m = require('src/lib/mithril')
const shell = require('../shell')
const t = require('src/lib/translation')

function inputView (scope) {
  return m.component(codemirror, {
    value: scope.query
  })
  return m('textarea.form-control', {
    id: scope.htmlId,
    config: function (el) {
      codemirror.fromTextArea(el, {
        lineNumbers: true,
        mode: 'text/javascript'
      })
    },
    onfocus: scope.focus,
    onblur: scope.blur,
    onkeydown: scope.keydown,
    rows: 10,
    title: t('shell.merger.title'),
    value: scope.query
  })
}

function controller (reportScope) {
  const scope = {
    inputView: inputView,
    icon: 'icon-new-releases',
    htmlId: 'merger',
    query: m.prop(reportScope.current)
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

module.exports = {
  controller: controller,
  view: view
}
