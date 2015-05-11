;(function (dime, m, Mousetrap, t) {
  'use strict';

  var module = dime.modules.help = {};

  module.controller = function () {
    var scope = {};

    dime.events.emit('help-before-view', scope);

    return scope;
  };

  var closeHelp = function () {
    dime.configuration.local.showHelp = false;
    m.redraw();
    return false;
  }

  module.view = function (scope) {

    if (dime.configuration.local.showHelp) {
      Mousetrap.bind('esc', closeHelp);
      return m('.modal-open', m('.modal', {
          style: 'display: block'
        },
        m('.modal-dialog.modal-xs', m('.modal-content', [
          m('.modal-heading', [
            m('a[href=#].modal-close', {
              onclick: closeHelp
            }),
            m('h2.modal-title', t('Shortcuts'))
          ]),
          m('.modal-inner', [
            m('div', 'Lorem Ipsum')
          ]),
          m('.modal-footer', [
            m('p.text-right', [
              m('button.btn.btn-flat.btn-alt[type=button]', {
                onclick: closeHelp
              }, t('Close'))
            ])
          ])
        ]))
      ));
    } else {
      return m('.empty');
    };
  };

  Mousetrap.bind('?', function(e) {
    dime.configuration.local.showHelp = true;
    m.redraw();
    return false;
  });

})(dime, m, Mousetrap, t);
