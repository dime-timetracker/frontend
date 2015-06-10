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
      m('div.form-help.form-help-msg', [
          m('span.basics', t('Enter a description to start an activity.')),
          m('ul', [
            m('li.dates.duration', t('You may specify a duration by entering something like 1h 10m or 1:10.')),
            m('li.dates.start', t('You may specify a start by entering something like 13:50-')),
            m('li.dates.end', t('You may specify an end by entering something like -15:10')),
            m('li.dates.start-and-end', t('You may specify start and end by entering something like 13:50-15:10')),
            m('li.customer', t('Use "@" to specify a customer.')),
            m('li.project', t('Use "/" to specify a project.')),
            m('li.service', t('Use ":" to specify a service.')),
            m('li.tags', t('Use "#" to add tags.'))
          ])
      ]),
      m('p.text-right', [
        m('button.btn.btn-flat.btn-alt[type=button]', {
          onclick: module.close
        }, t('Close'))
      ]),
      t('Help')
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
