'use strict'

const m = require('mithril')
const t = require('../../lib/translation')

const input = require('../utils/views/formfields/input')
const duration = require('../utils/views/duration')
const tile = require('../utils/views/tile')

const getStart = require('../timeslice').getStart
const getEnd = require('../timeslice').getEnd
const running = require('../timeslice').running
const getDuration = require('../timeslice').duration

function controller (args) {
  var scope = {
    timeslice: args.timeslice,
    changed: false,
    formatStart: (format) => { return getStart(args.timeslice).format(format) },
    formatEnd: (format) => { return getEnd(args.timeslice).format(format) },
    formatDuration: () => { return duration(getDuration(args.timeslice)) },
    isRunning: () => { return running(args.timeslice) },
  }

  scope.save = function (e) {
    if (e) {
      e.preventDefault();
    }
    args.activity.timeslices.persist(scope.timeslice).then(function () {
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
  var inner = [];

  // TODO Updates only when date/time picker available
  inner.push(input(scope.formatStart('HH:mm:ss'), {
    type: 'time',
    inline: true,
    update: function (value) {
      scope.timeslice.setStartTime(value);
      scope.timeslice.updateDuration();
      scope.changed = true;
    }
  }));

  inner.push(input(!scope.isRunning() ? scope.formatEnd('HH:mm:ss') : '', {
    type: 'time',
    inline: true,
    placeholder: 'HH:mm:ss',
    update: function (value) {
      scope.timeslice.setEndTime(value);
      scope.timeslice.updateDuration();
      scope.changed = true;
    }
  }));

  inner.push(input(scope.formatStart('YYYY-MM-DD'), {
    type: 'date',
    inline: true,
    update: function (value) {
      if (scope.timeslice.isSameDay()) {
        scope.timeslice.setEndDate(value);
      }
      scope.timeslice.setStartDate(value);
      scope.changed = true;
    }
  }));

  inner.push(input(!scope.isRunning() ? scope.formatEnd('YYYY-MM-DD') : '', {
    type: 'date',
    inline: true,
    placeholder: 'YYYY-MM-DD',
    update: function (value) {
      scope.timeslice.setEndDate(value);
      scope.timeslice.updateDuration();
      scope.changed = true;
    }
  }));

  var actions = [];
  actions.push(m('a.duration', scope.formatDuration()));
  actions.push(m('a.btn.btn-flat[href=#]', { onclick: scope.remove }, m('span.icon.icon-delete')));
  if (scope.changed) {
    actions.push(m('a.btn.btn-green[href=#]', { onclick: scope.save }, m('span.icon.icon-done')));
  }

  return tile(inner, { actions: actions });
}

module.exports = {
  controller: controller,
  view: view
};
