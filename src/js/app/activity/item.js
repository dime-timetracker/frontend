'use strict';

var m = require('mithril');
var t = require('../../lib/translation');

var grid = require('../utils/views/grid');
var tile = require('../utils/views/tile');

var timesliceList = require('./timesliceList');

var btnStartStop = require('./btnStartStop');

var formBuilder = require('../utils/components/formBuilder');
var toggleButton = require('../utils/components/toggleButton');

function controller (activityScope) {
  var scope = {};

  scope.model = activityScope.activity;
  scope.onSubmit = function (e) {
    if (e) {
      e.preventDefault();
    }

    activityScope.collection.persist(scope.model);
  };
  scope.onDelete = function (e) {
    if (e) {
      e.preventDefault();
    }

    var question = t('delete.confirm', { name: scope.model.toString() });
    if (global.window.confirm(question)) {
      activityScope.collection.remove(scope.model);
    }
  };

  scope.toggle = {
    timeslice: false,
    edit: false
  };

  return scope;
}

function view (scope) {
  var options = {
    actions: [],
    subs: []
  };
  options.actions.push(m.component(btnStartStop, {
    key: 'startstop-' + scope.model.uuid,
    activity: scope.model
  }));

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

    options.subs.push(grid(
      m.component(formBuilder, {
        key: 'form-' + scope.model.uuid,
        model: scope.model,
        onSubmit: scope.onSubmit,
        onDelete: scope.onDelete
      }),
      m.component(timesliceList, {
        key: 'timeslices-' + scope.model.uuid,
        activity: scope.model
      })
    ));
  }

  var inner = [];
  inner.push(m('span', scope.model.description));
  ['customer', 'project', 'service'].forEach(function (relation) {
    if (scope.model[relation]) {
      inner.push(m('span.badge', scope.model[relation].shortcut + scope.model[relation].alias));
    }
  });

  return tile(inner, options);
}

module.exports = {
  controller: controller,
  view: view
};
