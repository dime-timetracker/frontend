;(function (dime, moment, m, Mousetrap) {
  'use strict';

  var component = dime.modules.prompt.components.activity = {};

  component.controller = function (module) {
    var scope = {
      module: module,
      shortcut: module.shortcuts().focusPrompt
    };

    scope.focus = function (e) {
      module.currentTargetEvent = e;
      module.clearSuggestions(e, scope);
      module.installShortcuts(e, scope);
    };

    scope.blur = function (e) {
      module.resetShortcuts(e, scope);
      module.clearSuggestions(e, scope);
      module.currentTargetEvent = undefined;
    };

    scope.keydown = function (e) {
      module.updateSuggestions(e, scope);
    };

    scope.submit = function (e) {
      var data = dime.helper.parser.parse(e.target.value, ['customer', 'project', 'service', 'tags', 'times', 'description']);

      var activity = dime.resources.activity.create(data);

      if (_.isUndefined(data.timeslices) || 0 === data.timeslices.length) {
        activity.timeslices.add({});
      }

      if (_.isEmpty(data.description)) {
        activity.description = t('(Click here to enter a description!)');
      }

      if (activity.customer) {
        activity.customer = dime.resources.customer.find(activity.customer);
      }

      if (activity.project) {
        activity.project = dime.resources.project.find(activity.project);
        activity.customer = activity.project.customer;
      }

      activity.rate = activity.project.rate || activity.customer.rate;

      dime.resources.activity.persist(activity);
      scope.blur(e);
    };

    Mousetrap.bind(scope.shortcut, function(e) {
      document.getElementById('prompt').focus();
      return false;
    });

    return scope;
  };
  
  component.view = function (scope) {
    var input = m('input#prompt.form-control.mousetrap', {
      placeholder: t('Add an activity') + ' (' + dime.helper.format.mousetrapCommand(scope.shortcut, t) + ')',
      onfocus: scope.focus,
      onblur: scope.blur,
      onkeydown: scope.keydown
    });
    
    return m('.media', [m('.media-object.pull-left', m('label.form-icon-label', {for : 'prompt'}, m('span.icon.icon-access-time'))), m('.media-inner', input)]);
  };



})(dime, moment, m, Mousetrap);
