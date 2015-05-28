;(function (dime, m, Mousetrap, t) {
  'use strict';

  var module = dime.modules.help = {};

  module.controller = function () {
    var scope = {};

    dime.events.emit('help-before-view', scope);

    return scope;
  };

  module.view = function (scope) {
    Mousetrap.bind('esc', module.close);

    return dime.core.views.dialog(
      m('div', 'Lorem Ipsum'),
      m('p.text-right', [
        m('button.btn.btn-flat.btn-alt[type=button]', {
          onclick: module.close
        }, t('Close'))
      ]),
      t('Shortcuts')
    );
  };

  module.show = function () {
    m.mount(document.getElementById('modal'), module);
    return false;
  };

  module.close = function () {
    m.mount(document.getElementById('modal'), null);
    return false;
  };

  Mousetrap.bind('?', function(e) {
    return module.show();
  });

})(dime, m, Mousetrap, t);
