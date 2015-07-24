'use strict';

var m = require('mithril');
var duration = require('../utils/views/duration');

var component = {};

component.controller = function (activity, timeslice) {
  var scope = {
    timeslice: timeslice
  };

  scope.formatStart = function (format) {
    return timeslice.start().format(format);
  };

  scope.formatStop = function (format) {
    return timeslice.isRunning() ? timeslice.end().format(format) : '';
  };

  scope.formatDuration = function () {
    return duration(timeslice.totalDuration());
  };

  scope.remove = function (e) {
    if (e) {
      e.preventDefault();
    }
    activity.removeTimeslice(timeslice);
  };

  return scope;
};

component.view = function (scope) {
  var content = [];
  var start = scope.timeslice.start();
  var end = scope.timeslice.end();

  content.push(m('span.badge', start.format('YYYY-MM-DD')));
  content.push(m('span.time', start.format('HH:MM')));
  content.push(m('span.divider', ' - '));
  content.push(m('span.time', end.format('HH:MM')));

  return m('div.tile', content);
};



module.exports = component;
