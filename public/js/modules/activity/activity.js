;(function (dime, m, moment, _, Mousetrap) {
  'use strict';

  var module = dime.modules.activity = {};

  module.controller = function () {
    var scope = {};

    scope.activities = dime.resources.activity;
    scope.add = function (e) {
      scope.activities.persist(scope.activities.create());
    };

    dime.modules.activity.applyFilter = function () {
      var activities = dime.resources.activity;
      dime.events.emit('activity-view-collection-load', {
        collection: activities,
        scope: scope
      });
      _.forEach(dime.modules.activity.filters, function(filter) {
        activities = activities.filter(filter);
      });
      scope.activities = activities;
    };

    return scope;
  };
  module.views = {};
  module.view = function (scope) {
    Mousetrap.bind(dime.configuration.get(
      dime.configuration.activity.children.shortcuts.children.selectNext
    ), function(e) {
      if (_.isUndefined(dime.modules.activity.selectedIdx)) {
        dime.modules.activity.selectedIdx = 0;
      } else if (dime.modules.activity.selectedIdx === scope.activities.length-1) {
        dime.modules.activity.selectedIdx = undefined;
      } else {
        dime.modules.activity.selectedIdx++;
      }
      m.redraw();
    });

    Mousetrap.bind(dime.configuration.get(
      dime.configuration.activity.children.shortcuts.children.selectPrevious
    ), function(e) {
      if (_.isUndefined(dime.modules.activity.selectedIdx)) {
        dime.modules.activity.selectedIdx = scope.activities.length-1;
      } else if (0 === dime.modules.activity.selectedIdx) {
        dime.modules.activity.selectedIdx = undefined;
      } else {
        dime.modules.activity.selectedIdx--;
      }
      m.redraw();
    });

    Mousetrap.bind(dime.configuration.get(
      dime.configuration.activity.children.shortcuts.children.startStop
    ), function(e) {
      if (false === _.isUndefined(dime.modules.activity.selectedIdx)) {
        scope.activities[dime.modules.activity.selectedIdx].startStopTimeslice();
        m.redraw();
        return false;
      }
    });

    Mousetrap.bind(dime.configuration.get(
      dime.configuration.activity.children.shortcuts.children.editTags
    ), function() {
      if (false === _.isUndefined(dime.modules.activity.selectedIdx)) {
        dime.configuration.setLocal(
          'activity/' + scope.activities[dime.modules.activity.selectedIdx].id + '/tags/editable',
          1
        );
        m.redraw();
      }
      return false;
    });

    var list = scope.activities.map(dime.modules.activity.views.item);

    if (dime.resources.activity.pager && dime.resources.activity.pager.hasMore()) {
      list.push(m('div', m('a[href=#].btn.btn-block.margin-top', {
        onclick: function () {
          dime.resources.activity.pager.next();
          return false;
        }
      }, t('Show more'))));
    }

    return m(".tile-wrap", [ list, dime.core.views.button('Add Activity', '', scope.add) ]);

  };

  module.filters = {
    'default': function (activity) { return true; }
  };
  
  // register route
  dime.routes['/'] = dime.modules.activity;

  var lastUpdate = function (activity) {
    var result = parseInt(moment(activity.updatedAt || 'now').format('x'));
    if (false === _.isEmpty(activity.timeslices)) {
      result = activity.timeslices.reduce(function (prevMax, item) {
        var timestamp = parseInt(moment(item.updatedAt).format('x'));
        return prevMax < timestamp ? timestamp : prevMax;
      }, result);
    }
    return result;
  };

  // register resource
  dime.resources.activity = new dime.Collection({
    resourceUrl: 'activity',
    model: dime.model.Activity,
    compare: function (a, b) {
      var result = 0;
      if (a > b) {
        result = -1;
      } else if (a < b) {
        result = 1;
      }
      return result;
    },
    compareKey: lastUpdate
  });
  dime.resources.timeslice = new dime.Collection({
    resourceUrl: 'timeslice',
    model: dime.model.Timeslice,
    compare: function (a,b) {
      var result = 0;
      if (a > b) {
        result = -1;
      } else if (a < b) {
        result = 1;
      }
      return result;
    },
    compareKey: function (obj) {
      return parseInt(moment(obj.stoppedAt || obj.startedAt || obj.updatedAt || obj.createdAt).format('x'));
    }
  });
  dime.resources.tag = new dime.Collection({
    resourceUrl: 'tag',
    model: dime.model.Tag
  });

  dime.resources.activity.fetch();

  // add settings section
  dime.configuration.activity = {
    title: t('Activity'),
    description: t('Activity settings'),
    children: {
      display: {
        title: t('Display settings'),
        children: {}
      },
      shortcuts: {
        title: t('Shortcuts'),
        children: {
          selectNext: {
            title: 'Select next activity',
            namespace: 'activity',
            name: 'shortcuts/selectNext',
            type: 'text',
            defaultValue: 'j'
          },
          selectPrevious: {
            title: 'Select previous activity',
            namespace: 'activity',
            name: 'shortcuts/selectPrevious',
            type: 'text',
            defaultValue: 'k'
          },
          startStop: {
            title: 'Start/stop activity',
            namespace: 'activity',
            name: 'shortcuts/startStop',
            type: 'text',
            defaultValue: 'space'
          },
          editTags: {
            title: 'Edit tags of current activity',
            namespace: 'activity',
            name: 'shortcuts/editTags',
            type: 'text',
            defaultValue: 't'
          },
          confirmTag: {
            title: 'Confirm tag',
            namespace: 'activity',
            name: 'shortcuts/confirmTag',
            type: 'text',
            defaultValue: 'space'
          },
          removeLatestTag: {
            title: 'Remove latest tag',
            namespace: 'activity',
            name: 'shortcuts/removeLatestTag',
            type: 'text',
            defaultValue: 'backspace'
          },
          confirmAllTags: {
            title: 'Confirm all tags',
            namespace: 'activity',
            name: 'shortcuts/confirmAllTags',
            type: 'text',
            defaultValue: 'enter'
          }
        }
      }
    }
  };

})(dime, m, moment, _, Mousetrap);
