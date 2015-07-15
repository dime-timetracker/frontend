'use strict';

var m = require('mithril');
var moment = require('moment');
var input = require('../../core/views/form/input');
var duration = require('../../core/helper/duration');

var component = {};

component.controller = function (activity, timeslice) {
  var scope = {};

  scope.formatStart = function (format) {
    return moment(timeslice.startedAt).format(format);
  }

  scope.formatStop = function (format) {
    return scope.hasEnd() ? moment(timeslice.stoppedAt).format(format) : '';
  }

  scope.hasEnd = function () {
    return timeslice.stoppedAt !== undefined || timeslice.stoppedAt !== null;
  }

  scope.formatDuration = function () {
     return duration(timeslice.totalDuration())
  };

  scope.remove = function (e) {
    if (e) e.preventDefault();
    activity.removeTimeslice(timeslice);
  };

  return scope;
}

component.view = function (scope) {
  var tr = [];

  tr.push(m('td.start', input(scope.formatStart('YYYY-MM-DD'), undefined, 'date')));
  tr.push(m('td.start', input(scope.formatStart('HH:mm:ss'), undefined, 'time')));
  tr.push(m('td.stop', input(scope.formatStop('HH:mm:ss'), undefined, 'time')));
  tr.push(m('td.stop', input(scope.formatStop('YYYY-MM-DD'), undefined, 'date')));

  tr.push(m('td.duration', scope.formatDuration()));
  tr.push(m('td.actions.text-right', [
    m('button.btn.btn-flat', { onclick: scope.remove }, m('span.icon.icon-delete'))
  ]));

  return m('tr', tr);
};



module.exports = component;
