'use strict';

var m = require('mithril');
var t = require('../../../translation');
var btnStartStop = require('./btnStartStop');

module.exports = function (activity) {
  return m('ul.nav.nav-list.pull-right', [
      m('li.toggle-timeslices', m('a', {
        href: '#',
        title: t('Show timeslices'),
        onclick: function() { activity.toggleTimeslices(); return false; }
      }, m('span.icon.icon-access-time'))),
      m('li.start-stop-button', btnStartStop(activity)),
      m('li.remove', m('a', {
        href: '#',
        title: t('Delete'),
        onclick: function() {
          var question = t('Do you really want to delete "[activity]"?').replace('[activity]', activity.description);
          if (confirm(question)) activity.remove();
          return false;
        }
      }, m('span.icon.icon-delete')))
    ]);
};
