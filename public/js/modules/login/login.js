'use strict';

(function (dime, _, m, t) {

  dime.modules.login = {
    controller: function () {
      var scope = {};

      if (_.isUndefined(dime.authorized)) {
        m.route('/');
      }

      return scope;
    },
    view: function (scope) {
      return m('form', {
        onsubmit: function(e) {
          dime.username = scope.username;
          dime.password = scope.password;
          dime.authorized = true;
          m.route('/');
        }
      }, [
        m('input', {
          onchange: function(e) {
            scope.username = e.target.value;
          }
        }),
        m('input[type=password]', {
          onchange: function(e) {
            scope.password = e.target.value;
          }
        }),
        m('input[type=submit]', {
          value: t('Login')
        }),
      ])
    }
  };

  dime.modules.login.redirect = function (response) {
    if (_.isObject(response) && 401 === result.httpStatus) {
      dime.authorized = false;
      return m.route('/login');
    }
  };

  dime.modules.login.success = function () {
    if (dime.user) {
      dime.resources.activity.config.user = dime.username;
    }
    if (dime.username) {
      dime.resources.activity.config.password = dime.password;
    }
  }

  // register route
  dime.routes['/login'] = dime.modules.login;

})(dime, _, m, t)
