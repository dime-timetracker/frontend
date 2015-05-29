;
(function (dime, moment, m, Mousetrap) {
  'use strict';

  var component = dime.modules.prompt.components.filter = {};

  component.controller = function (module) {
    var scope = {
      module: module,
      shortcut: module.shortcuts().focusFilter
    };

    scope.focus = function (e) {
      module.clearSuggestions(e, scope);
      module.installShortcuts(e, scope);
    };

    scope.blur = function (e) {
      module.resetShortcuts(e, scope);
      module.clearSuggestions(e, scope);
    };

    scope.keydown = function (e) {
      module.updateSuggestions(e, scope);
    };

    scope.submit = function (e) {
      var data = dime.helper.parser.parse(e.target.value, ['customer', 'project', 'service', 'tags', 'times', 'filterTimes', 'description']);

      dime.modules.activity.filters = {
        'default': function (activity) { return true; }
      };
      var filter = dime.helper.parser.parse(e.target.value, ['customer', 'project', 'service', 'tags', 'times', 'filterTimes', 'description']);
      _.forIn(filter, function(value, key) {
        if (_.isPlainObject(value) && _.isString(value.alias)) {
          dime.modules.activity.filters[key] = function(activity) {
            return activity[key] && activity[key].alias === value.alias;
          };
        }
      });
      if (filter.description.length) {
        dime.modules.activity.filters.description = function(activity) {
          return _.contains(activity.description, filter.description);
        };
      }
      if (filter.startedAt) {
        dime.modules.activity.filters.startedAt = function (activity) {
          return activity.timeslices.some(function (timeslice) {
            return moment(timeslice.startedAt).isAfter(filter.startedAt);
          });
        };
      }
      if (filter.stoppedAt) {
        dime.modules.activity.filters.stoppedAt = function (activity) {
          return activity.timeslices.some(function (timeslice) {
            return moment(timeslice.stoppedAt).isBefore(filter.stoppedAt);
          });
        };
      }
      dime.modules.activity.applyFilter();

      scope.blur(e);
    };

    Mousetrap.bind(scope.shortcut, function(e) {
      document.getElementById('filter').focus();
      return false;
    });

    return scope;
  };

  component.view = function (scope) {
    var input = m('input#filter.form-control.mousetrap', {
      placeholder: t('Filter activities') + ' (' + dime.helper.format.mousetrapCommand(scope.shortcut, t) + ')',
      onfocus: scope.focus,
      onblur: scope.blur,
      onkeydown: scope.keydown
    });

    return m('.media', [m('.media-object.pull-left', m('label.form-icon-label', {for : 'filter'}, m('span.icon.icon-filter-list'))), m('.media-inner', input)]);
  };

})(dime, moment, m, Mousetrap);
