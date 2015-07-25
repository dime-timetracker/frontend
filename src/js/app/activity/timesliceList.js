'use strict';

var m = require('mithril');
var t = require('../../lib/translation');
var timesliceItem = require('./timesliceItem');

function controller (args) {
  var scope = {};

  scope.add = function (e) {
    if (e) {
      e.preventDefault();
    }
    args.activity.addTimeslice();
  };

  scope.items = args.activity.timeslices.map(function (timeslice) {
    return m.component(timesliceItem, {
      key: timeslice.uuid,
      activity: args.activity,
      timeslice: timeslice
    });
  });

  return scope;
}

function view (scope) {
  return m('.tiles', scope.items);
  // return m('table.table.table-inline.table-bordered.table-hover', [
  //   m('thead',
  //     m('tr', [
  //       m('th', t('Start')),
  //       m('th', t('End')),
  //       m('th', t('Duration')),
  //       m('th.text-right', m('buttn.btn.btn-flat', { onclick: scope.add }, m('span.icon.icon-add')))
  //     ])
  //   ),
  //   m('tbody', scope.items)
  // ]);
}

module.exports = {
  controller: controller,
  view: view
};
