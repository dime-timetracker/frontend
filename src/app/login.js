'use strict'

const m = require('src/lib/mithril')
const t = require('../lib/translation')
const authorize = require('../lib/authorize')
const card = require('./utils/views/card/default')
const formGroup = require('./utils/views/formfields/group')

function controller () {
  const scope = {}

  if (authorize.is()) {
    m.route('/')
  }

  return scope
}

function view (scope) {
  return card(
    m('form.form', {
      onsubmit: function (e) {
        authorize.signin(scope.username, scope.password).then(function (response) {
          m.route('/')
        }, function (response) {
          m.route('/login')
        })
        return false
      }
    }, [
      formGroup(
        m('input#username.form-control', {
          onchange: function (e) {
            scope.username = e.target.value
          }
        }),
        t('Username')
      ),

      formGroup(
        m('input[type=password]#password.form-control', {
          onchange: function (e) {
            scope.password = e.target.value
          }
        }),
        t('Password')
      ),
      formGroup(
        m('input[type=submit].btn.btn-block.btn-blue', {
          value: t('Login')
        })
      )
    ]),
    t('Login')
  )
}

module.exports = { controller, view }
