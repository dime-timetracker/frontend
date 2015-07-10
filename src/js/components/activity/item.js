'use strict';

var m = require('mithril');
var t = require('../../translation');
var timesliceList =  require('./timesliceList')

var badge = require('./badge');
var btnStartStop = require('./btnStartStop');

var component = {};

component.controller = function (activity) {
  var scope = {};

  scope.model = activity;

  scope.toggleTimeslices = function (e) {
    if (e) e.preventDefault();
     activity.toggleTimeslices();
  };

  scope.updateDescription = function (e) {
    if (e) e.preventDefault();
    activitiy.updateDescription(e.target.textContent);
  };

  scope.remove = function (e) {
    if (e) e.preventDefault();
      var question = t('Do you really want to delete "[activity]"?').replace('[activity]', activity.description);
      if (global.window.confirm(question)) {
        activity.remove();
      }
  }

  return scope;
};

component.view = function (scope) {
  var inner = [];

  inner.push(m('button.btn.btn-flat', {
    title: t('Show timeslices'),
    onclick: scope.toggleTimeslices
  }, m('span.icon.icon-access-time')));

  inner.push(m('button.btn.btn-flat.pull-right', { onclick: scope.remove, title: t('Delete') }, m('span.icon.icon-delete')));
  inner.push(m('span.pull-right', m.component(btnStartStop, scope.model)));

  // Description
  inner.push(m('span', {
    contenteditable: true,
    oninput: scope.updateDescription
  }, scope.model.description));

  // Badges for customer, project, service
  inner.push(m.component(badge, scope.model.customer));
  inner.push(m.component(badge, scope.model.project));
  inner.push(m.component(badge, scope.model.service));

  var content = [];
  content.push(m('.tile-inner', inner));

  if (scope.model.showTimeslices) {
    content.push(m('.tile-sub', m.component(timesliceList, scope.model)));
  }

  return m('.tile', content);
};

module.exports = component;
