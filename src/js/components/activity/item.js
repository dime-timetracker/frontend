'use strict';

var m = require('mithril');
var t = require('../../translation');
var tile = require('../../core/views/tile');
var timesliceList = require('./timesliceList');

var btnStartStop = require('./btnStartStop');
var description = require('./description');

var component = {};

component.controller = function(activity) {
  var scope = {};

  scope.model = activity;

  scope.toggleTimeslices = function(e) {
    if (e) {
      e.preventDefault();
    }
    activity.toggleTimeslices();
  };

  scope.updateDescription = function(e) {
    if (e) {
      e.preventDefault();
    }
    activity.updateDescription(e.target.textContent);
  };

  scope.remove = function(e) {
    if (e) {
      e.preventDefault();
    }
    var question = t('Do you really want to delete "[activity]"?')
      .replace('[activity]', activity.description);
    if (global.window.confirm(question)) {
      activity.remove();
    }
  };

  return scope;
};

component.view = function(scope) {
  var options = {
    actions: [],
    subs: []
  };
  options.actions.push(m.component(btnStartStop, scope.model));
  options.actions.push(m('a.btn.btn-flat', {
    title: t('Show timeslices'),
    onclick: scope.toggleTimeslices
  }, m('span.icon.icon-edit.icon-lg')));

  if (scope.model.showTimeslices) {
    options.subs.push(m.component(timesliceList, scope.model));
  }

  return tile(m.component(description, scope.model), options);
};

module.exports = component;
