'use strict';

var m = require('src/lib/mithril');
var t = require('../lib/translation');
var authorize = require('../lib/authorize');
var card = require('./utils/views/card/default');
var formGroup = require('./utils/views/formfields/group');

var component = {};

component.controller = function () {
  var scope = {};

  if (authorize.is()) {
    m.route('/');
  }

  return scope;
};

component.view = function (scope) {
  return card(
    m('form.form', {
      onsubmit: function(e) {
        authorize.signin(scope.username, scope.password).then(function (response) {
          m.route('/');
        }, function (response) {
          m.route('/login');
        });
        return false;
      }
    }, [
      formGroup(
        m('input#username.form-control', {
          onchange: function(e) {
            scope.username = e.target.value;
          }
        }),
        t('Username')
      ),

      formGroup(
        m('input[type=password]#password.form-control', {
          onchange: function(e) {
            scope.password = e.target.value;
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
  );
};

module.exports = component;