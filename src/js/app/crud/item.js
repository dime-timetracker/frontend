'use strict';

var m = require('mithril');
var t = require('../../lib/translation');
var tile = require('../utils/views/tile');
var formBuilder = require('../utils/components/formBuilder');
var toggleButton = require('../utils/components/toggleButton');

function controller (args) {
  var scope = {
    model: args.model,
    show: false
  };

  scope.onSubmit = function (e) {
    if (e) {
      e.preventDefault();
    }

    args.collection.persist(scope.model);
    scope.show = false;
  };

  scope.onDelete = function (e) {
    if (e) {
      e.preventDefault();
    }

    var question = t('delete.confirm', { name: scope.model.toString() });
    if (global.window.confirm(question)) {
      args.collection.remove(scope.model);
      scope.show = false;
    }
  };

  return scope;
}

function view (scope) {
  var inner = [
    scope.model.toString()
  ];
  if (scope.model.alias) {
    inner.push(m('span.badge', scope.model.shortcut + scope.model.alias));
  }

  var options = {
    active: (scope.show) ? true : false
  };

  options.actions = m.component(toggleButton, {
    iconName: '.icon-edit',
    currentState: function() {
      return scope.show;
    },
    changeState: function (state) {
      scope.show = state;
    }
  });

  if (scope.show) {
    options.subs = m.component(formBuilder, {
      key: 'form-' + scope.model.uuid,
      model: scope.model,
      onSubmit: scope.onSubmit,
      onDelete: scope.onDelete
    });
  }

  return tile(inner, options);
}

module.exports = {
  controller: controller,
  view: view
};
