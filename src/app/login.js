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

function greeting () {
  return m('h2', t('login.greeting'))
}

function introduction () {
  return m('.introduction', t('login.introduction'))
}

function loginForm (scope) {
  return card(
    m('form.form#login', {
      onsubmit: scope.onLoginFormSubmit
    }, [
      formGroup(m('input[type=text]#username.form-control', {
        onchange: function (e) { scope.username = e.target.value }
      }), t('login.form.username')),
      formGroup(m('input[type=password]#password.form-control', {
        onchange: function (e) { scope.password = e.target.value }
      }), t('login.form.password')),
      formGroup(m('input[type=submit].btn.btn-block.btn-blue', {
        value: t('login.signin.submit')
      }))
    ]),
    t('login.signin.title')
  )
}

function registrationForm (scope) {
  return card(
    m('form.form#registration', {
      onsubmit: scope.onRegistrationFormSubmit
    }, [
      formGroup(m('input[type=text]#username.form-control', {
        onchange: function (e) { scope.username = e.target.value }
      }), t('login.form.username')),
      formGroup(m('input[type=password]#password.form-control', {
        onchange: function (e) { scope.password = e.target.value }
      }), t('login.form.password')),
      formGroup(m('input[type=email]#email.form-control', {
        onchange: function (e) { scope.email = e.target.value }
      }), t('login.form.email')),
      formGroup(m('input[type=text]#firstname.form-control', {
        onchange: function (e) { scope.firstname = e.target.value }
      }), t('login.form.firstname')),
      formGroup(m('input[type=text]#lastname.form-control', {
        onchange: function (e) { scope.lastname = e.target.value }
      }), t('login.form.lastname')),
      formGroup(m('input[type=submit].btn.btn-block.btn-blue', {
        value: t('login.registration.submit')
      }))
    ]),
    t('login.registration.title')
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
  scope.onRegistrationFormSubmit = function () {
    authorize.register(scope.username, scope.password, scope.email, scope.firstname, scope.lastname)
      .then(function () {
        authorize.signin(scope.username, scope.password)
          .then(scope.loginSuccess)
          .catch(scope.loginFailed)
      })
      .catch(scope.loginFailed)
    return false
  }

  return scope
}

function view (scope) {
  return m('.guest', [
    m('.row',
      m('.col-md-12.text-center',
        card([
          greeting(),
          introduction()
        ])
      )
    ),
    m('.row',
      m('.col-md-6.col-sm-12',
        loginForm(scope)
      ),
      m('.col-md-6.col-sm-12',
        registrationForm(scope)
      )
    )
  ])
}

module.exports = { controller, view, setOnLaunch }
