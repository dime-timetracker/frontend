;(function (dime, _, m, t) {
  'use strict';

  var module = dime.modules.login = {
    controller: function () {
      var scope = {};

      if (dime.authorize.is()) {
        m.route('/');
      }

      return scope;
    },
    view: function (scope) {
      return dime.core.views.card(
        m('form.form', {
          onsubmit: function(e) {
            dime.authorize.signin(scope.username, scope.password).then(function (response) {
              m.route('/');
            }, function (response) {
              m.route('/login');
            });
            return false;
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

  // register route
  dime.routes['/login'] = dime.modules.login;

  dime.menu.push({
    id: "logout",
    name: "Logout",
    icon: 'icon-exit-to-app',
    weight: 2000,
    onclick: function (e) {
      dime.authorize.signout();
    }
  });

})(dime, _, m, t)
