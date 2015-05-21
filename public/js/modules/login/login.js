;(function (dime, _, m, t) {
  'use strict';

  var module = dime.modules.login = {
    controller: function () {
      var scope = {};

      if (_.isUndefined(dime.authorized)) {
        m.route('/');
      }

      return scope;
    },
    view: function (scope) {
      return dime.core.views.card(
        m('form.form', {
          onsubmit: function(e) {
            dime.username = scope.username;
            dime.password = scope.password;
            dime.authorized = true;
            m.route('/');
          }
        }, [
          dime.core.views.formGroup(
            m('input#username.form-control', {
              onchange: function(e) {
                scope.username = e.target.value;
              }
            }),
            t('Username')
          ),

          dime.core.views.formGroup(
            m('input[type=password]#password.form-control', {
              onchange: function(e) {
                scope.password = e.target.value;
              }
            }),
            t('Password')
          ),
          dime.core.views.formGroup(
            m('input[type=submit].btn.btn-block.btn-blue', {
              value: t('Login')
            })
          )
        ]),
        t('Login')
      );
    }
  };

  module.redirect = function (response) {
    if (_.isObject(response) && 401 === result.httpStatus) {
      dime.authorized = false;
      return m.route('/login');
    }
  };

  module.success = function () {
    if (dime.user) {
      dime.resources.activity.config.user = dime.username;
    }
    if (dime.username) {
      dime.resources.activity.config.password = dime.password;
    }
  };

  // register route
  dime.routes['/login'] = dime.modules.login;

})(dime, _, m, t)
