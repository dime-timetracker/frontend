'use strict'

const m = require('src/lib/mithril')
const t = require('../lib/translation')
const authorize = require('../lib/authorize')
const card = require('./utils/views/card/default')
const formGroup = require('./utils/views/formfields/group')
const settingsApi = require('../api/setting')
const settings = require('./setting')

let launchApp = function () {
  // this function is to be set from application context
}

function setOnLaunch (onLaunch) {
  launchApp = onLaunch
}

function loginForm (scope) {
  return card(
    m('form.form#login', {
      onsubmit: scope.onLoginFormSubmit
    }, [
      formGroup(m('input[type=text]#username.form-control', {
        onchange: function (e) { scope.username = e.target.value }
      }), t('Username')),
      formGroup(m('input[type=password]#password.form-control', {
        onchange: function (e) { scope.password = e.target.value }
      }), t('Password')),
      formGroup(m('input[type=submit].btn.btn-block.btn-blue', {
        value: t('Login')
      }))
    ]),
    t('Login')
  )
}

function controller (context) {
  const scope = {}

  if (authorize.is()) {
    m.route('/')
  }

  scope.loginSuccess = function () {
    settingsApi.fetchAll().then((userSettings) => {
      settings.userSettings(userSettings)
      launchApp()
      m.route('/')
    })
  }
  scope.loginFailed = function () { m.route('/login') }
  scope.onLoginFormSubmit = function () {
    authorize.signin(scope.username, scope.password)
      .then(scope.loginSuccess)
      .catch(scope.loginFailed)
    return false
  }

  return scope
}

function view (scope) {
  return m('.guest', [
    loginForm(scope)
  ])
}

module.exports = { controller, view, setOnLaunch }
