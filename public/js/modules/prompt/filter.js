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
      module.currentTargetEvent = e;
      module.clearSuggestions(e, scope);
      component.addBookmarks(e, scope);
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
      scope.query = e.target.value;
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
        if (_.isArray(value)) {
          var filterTags = _.pluck(value, 'name');
          dime.modules.activity.filters[key] = function(activity) {
            var activityTags = _.pluck(activity.tags, 'name');
            return filterTags.length == _.intersection(filterTags, activityTags).length;
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
    var shortcut = dime.helper.format.mousetrapCommand(scope.shortcut, t);
    var filterProperties = {
      placeholder: t('Filter activities') + ' (' + shortcut + ')',
      onfocus: scope.focus,
      onblur: scope.blur,
      onkeydown: scope.keydown,
      onkeyup: function(e) {
        scope.isBookmarked = scope.module.components.bookmark.contains(e.target.value);
        scope.module.components.bookmark.value = e.target.value;
      }
    };

    var input = m('input#filter.form-control.mousetrap', filterProperties);

    var btnBookmark = m('.media-object.pull-right',
      m('span.form-icon-label', {
        onclick: scope.module.components.bookmark.show
      }, m('span.icon.icon-bookmark' + (scope.isBookmarked ? '' : '-outline'))
      )
    );

    return m('.media', [
        m('.media-object.pull-left',
          m('label.form-icon-label', {for : 'filter'}, m('span.icon.icon-filter-list'))
        ),
        btnBookmark,
        m('.media-inner', input)
    ]);
  };

  component.addBookmarks = function(e, scope) {
    scope.module.suggestions = scope.module.components.bookmark.list();
  };

  // Add default filter to activity setting

  dime.configuration.activity.children.display.children.defaultFilter = {
    title: "Default filter",
    namespace: "activity",
    name: "display/defaultFilter",
    type: "text",
    defaultValue: ""
  };

})(dime, moment, m, Mousetrap);
