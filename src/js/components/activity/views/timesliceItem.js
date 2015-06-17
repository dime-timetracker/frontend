'use strict';

var m = require('mithril');
var helper = require('../../../core/helper');
var input = require('../../../core/views/inputs/input');

module.export = function (timeslice) {
  var activity = this;
  var start = moment(timeslice.startedAt);
  var tr = [];

  tr.push(m('td.start', input(start.format('YYYY-MM-DD'), undefined, 'date')));
  tr.push(m('td.start', input(start.format('HH:mm:ss'), undefined, 'time')));
  if (timeslice.stoppedAt) {
    var stop = moment(timeslice.stoppedAt);
    tr.push(m('td.stop', input(stop.format('HH:mm:ss'), undefined, 'time')));
    tr.push(m('td.stop', input(stop.format('YYYY-MM-DD'), undefined, 'date')));
  } else {
    tr.push(m('td.stop', ''));
    tr.push(m('td.stop', ''));
  }

  tr.push(m('td.duration#timeslice-duration-' + timeslice.id, helper.duration(timeslice.totalDuration(), 'seconds')));
  tr.push(m('td.actions.text-right', [
    m('a.btn.btn-flat[href=#]', {onclick: function () {
        activity.removeTimeslice(timeslice);
        return false;
      }}, m('span.icon.icon-delete'))
  ]));

  return m('tr#timeslice-' + timeslice.id, tr);
};