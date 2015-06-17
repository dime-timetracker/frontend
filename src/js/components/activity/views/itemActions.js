'use strict';

var m = require('mithril');
var t = require('../../../translation');
var startStopButton = require('./btnStartStop');

module.exports = function (activitiy) {
  return m('ul.nav.nav-list.pull-right', [
      m('li.toggle-timeslices', m('a', {
        href: '#',
        title: t('Show timeslices'),
        onclick: function() { activitiy.toggleTimeslices(); return false; }
      }, m('span.icon.icon-access-time'))),
      m('li.start-stop-button', startStopButton(activitiy)),
      m('li.remove', m('a', {
        href: '#',
        title: t('Delete'),
        onclick: function() {
          var question = t('Do you really want to delete "[activity]"?').replace('[activity]', activitiy.description);
          if (confirm(question)) activitiy.remove();
          return false;
        }
      }, m('span.icon.icon-delete')))
    ]);
};