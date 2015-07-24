'use strict';

var m = require('mithril');
var t = require('../../lib/translation');
var timesliceItem = require('./timesliceItem');

var component = {};

component.controller = function (activity) {
  var scope = {};

  scope.add = function (e) {
    if (e) e.preventDefault();

    activity.addTimeslice();
  }

  scope.items = activity.timeslices.map(function (timeslice) {
    return m.component(timesliceItem, this, timeslice);
  }, activity);

  return scope;
};

component.view = function (scope) {
  return m('.cards', scope.items);
  // return m('table.table.table-inline.table-bordered.table-hover', [
  //   m('thead',
  //     m('tr', [
  //       m('th', {colspan: 2}, t('Start')),
  //       m('th', {colspan: 2}, t('End')),
  //       m('th', t('Duration')),
  //       m('th.text-right', m('buttn.btn.btn-flat', { onclick: scope.add }, m('span.icon.icon-add')))
  //     ])
  //   ),
  //   m('tbody', )
  // ]);
};

module.exports = component;
