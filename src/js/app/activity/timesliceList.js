'use strict';

var m = require('mithril');
var t = require('../../lib/translation');
var timesliceItem = require('./timesliceItem');

function controller (activity) {
  var scope = {};

  scope.add = function (e) {
    if (e) {
      e.preventDefault();
    }

    activity.addTimeslice();
  }

  scope.items = activity.timeslices.map(function (timeslice) {
    return m.component(timesliceItem, { activity: this, timeslice: timeslice, key: timeslice.uuid});
  }, activity);

  return scope;
}

function view (scope) {
  return m('table.table.table-inline.table-bordered.table-hover', [
    m('thead',
      m('tr', [
        m('th', {colspan: 2}, t('Start')),
        m('th', {colspan: 2}, t('End')),
        m('th', t('Duration')),
        m('th.text-right', m('buttn.btn.btn-flat', { onclick: scope.add }, m('span.icon.icon-add')))
      ])
    ),
    m('tbody', scope.items)
  ]);
}

module.exports = {
  controller: controller,
  view: view
};
