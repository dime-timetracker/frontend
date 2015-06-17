'use strict';

var m = require('mithril');
var t = require('../../../translation');
var views = {
  item: require('./timesliceItem')
};

module.exports = function (activity) {
  var items = activity.timeslices || [];

  var tableHead = m('thead',
    m('tr', [
      m('th', {colspan: 2}, t('Start')),
      m('th', {colspan: 2}, t('End')),
      m('th', t('Duration')),
      m('th.text-right', m('a.btn.btn-flat[href=#]', {
        onclick: function clickTimesliceAdd(e) {
          activity.addTimeslice();
          return false;
        }
      }, m('span.icon.icon-add')))
    ])
  );

  return m('table.table.table-inline.table-bordered.table-hover', [
    tableHead,
    m('tbody', items.map(views.item, activity))
  ]);
};