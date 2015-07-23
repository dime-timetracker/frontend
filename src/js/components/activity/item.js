'use strict';

var m = require('mithril');
var t = require('../../translation');
var tile = require('../../core/views/tile');
var buildForm = require('../../core/helper/build/form');
var formView = require('../../core/views/form');
var timesliceList = require('./timesliceList');

var btnStartStop = require('./btnStartStop');
var toggleButton = require('../../core/components/toggleButton');

var component = {};

component.controller = function(activity, collection) {
  var scope = {};

  scope.model = activity;
  scope.form = buildForm(activity, collection);
  scope.toggle = {
    timeslice: false,
    edit: false
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
  options.actions.push(m.component(
    toggleButton,
    '.icon-access-time',
    scope.toggle.timeslice,
    function (state) {
      scope.toggle.timeslice = state;
    }
  ));
  options.actions.push(m.component(
    toggleButton,
    '.icon-edit',
    scope.toggle.edit,
    function (state) {
      scope.toggle.edit = state;
    }
  ));

  if (scope.toggle.edit) {
    options.active = true;
    options.subs.push(scope.form.items.map(formView));

    var subActions = [];
    subActions.push(
      m('a.btn.btn-flat', {
        config: m.route,
        href: m.route(),
        onclick: scope.form.remove
      }, m('span.icon.icon-delete'))
    );

    if (scope.form.changed) {
      subActions.push(
        m('a.btn.btn-green.pull-right', {
          config: m.route,
          href: m.route(),
          onclick: scope.form.save
        }, m('span.icon.icon-done'))
      );
    }
    options.subs.push(subActions);
  }

  if (scope.toggle.timeslice) {
    options.active = true;
    options.subs.push(m.component(timesliceList, scope.model));
  }

  var inner = [];
  inner.push(m('span', scope.model.description));
  ['customer', 'project', 'service'].forEach(function (relation) {
    if (scope.model[relation]) {
      inner.push(m('span.badge', scope.model[relation].shortcut + scope.model[relation].alias));
    }
  });

  return tile(inner, options);
};

module.exports = component;
