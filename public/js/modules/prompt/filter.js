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
      scope.query = undefined;
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
        scope.isBookmarked = isSavedFilter(e.target.value);
      }
    }
    if (_.isString(scope.query)) {
      filterProperties.value = scope.query;
    }

    var input = m('input#filter.form-control.mousetrap', filterProperties);

    var getSavedFilters = function () {
      var filters = JSON.parse(dime.modules.setting.get('activity', 'filters'));
      return _.isArray(filters) ? filters : [];
    };

    var isSavedFilter = function (query) {
      var filters = getSavedFilters();
      return 1 == filters.filter(function(filter) {
        return filter.query == query
      }).length;
    }

    var savedFilters = function () {
      var filters = getSavedFilters();
      var options = filters.map(function renderFilterOption (filter) {
        return m('option', { value: filter.query }, filter.name);
      });
      options.unshift(m('option'));
      return options;
    }

    var selector = m('.media-object.pull-right',
      m('select.savedFilters.form-control.form-control-inline', {
        style: 'width: 20px',
        onchange: function (e) {
          scope.query = e.target.options[e.target.selectedIndex].value;
          scope.submit(e);
          return false;
        }
      }, savedFilters())
    );

    var saveFilterButton = m('.media-object.pull-right',
      m('span.form-icon-label', {
        onclick: function () {
          scope.showBookmarkForm = scope.showBookmarkForm ? false : true;
        }
      }, m('span.icon.icon-bookmark' + (scope.isBookmarked ? '' : '-outline'))
      )
    );

    var saveFilter = function(e) {
      var bookmarks = getSavedFilters();
      bookmarks.push({ name: e.target.value, query: scope.query });
      dime.modules.setting.set('activity', 'filters', JSON.stringify(bookmarks));
      scope.isBookmarked = true;
      scope.showBookmarkForm = false;
    };

    var bookmarkForm = m('.save-bookmark.card.col-lg-10', {
      style: 'position: absolute'
    }, m('.card-main', [
      m('.card-inner', m('p', m('input.form-control', {
        autofocus: 'autofocus',
        placeholder: t('Name your bookmarked filter'),
        onchange: saveFilter
      })))
    ]));

    return m('div', [
      m('.media', [
        m('.pull-left',
          m('label.form-icon-label', {for : 'filter'}, m('span.icon.icon-filter-list'))
        ),
        m('.media-inner.pull-left.col-lg-10', input),
        selector,
        saveFilterButton
      ]),
      scope.showBookmarkForm ? bookmarkForm : null
    ]);
  };
})(dime, moment, m, Mousetrap);
