'use strict';

var m = require('mithril');
var t = require('../../lib/translation');

var timeslices = require('../../lib/collection/timeslices');

var input = require('../utils/views/form/input');
var duration = require('../utils/views/duration');

function controller (args) {
  var scope = {
    timeslice: args.timeslice,
    changed: false
  };

  scope.formatStart = function (format) {
    return scope.timeslice.getStart().format(format);
  };

  scope.formatEnd = function (format) {
    return scope.timeslice.getEnd().format(format);
  };

  scope.formatDuration = function () {
     return duration(scope.timeslice.getDuration());
  };

  scope.save = function (e) {
    if (e) {
      e.preventDefault();
    }
    timeslices.persist(scope.timeslice).then(function () {
      scope.changed = false;
    });
  };

  scope.remove = function (e) {
    if (e) {
      e.preventDefault();
    }
    var question = t('Do you really want to delete "[name]"?', { name: scope.formatDuration() });
    if (global.window.confirm(question)) {
      args.activity.removeTimeslice(scope.timeslice);
    }
  };

  return scope;
}

function view (scope) {
  var start = [];
  var end = [];

  start.push(input(scope.formatStart('YYYY-MM-DD'), function (value) {
    if (scope.timeslice.isSameDay()) {
      scope.timeslice.setEndDate(value);
    }
    scope.timeslice.setStartDate(value);
    scope.changed = true;
  }, 'date'));
  start.push(input(scope.formatStart('HH:mm:ss'), function (value) {
    scope.timeslice.setStartTime(value);
    scope.changed = true;
  }, 'time'));

  end.push(input(scope.formatEnd('HH:mm:ss'), function (value) {
    scope.timeslice.setEndTime(value);
    scope.changed = true;
  }, 'time'));
  end.push(input(scope.formatEnd('YYYY-MM-DD'), function (value) {
    scope.timeslice.setEndDate(value);
    scope.changed = true;
  }, 'date'));

  var tr = [];

  tr.push(m('td.start', start));
  tr.push(m('td.end', end));
  tr.push(m('td.duration', scope.formatDuration()));

  var actions = [];
  tr.push(m('td.actions.text-right', actions));

  if (scope.changed) {
    actions.push(m('button.btn.btn-green', { onclick: scope.save }, m('span.icon.icon-done')));
  }
  actions.push(m('button.btn.btn-flat', { onclick: scope.remove }, m('span.icon.icon-delete')));

  return m('tr', tr);
}

module.exports = {
  controller: controller,
  view: view
};
