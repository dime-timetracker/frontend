'use strict';

(function (dime, _, moment, m) {

  dime.modules.activity = {
    controller: function () {
      var scope = {
        activities: [],
        filter: {
          help: false,
          suggestions: []
        }
      };

      dime.modules.activity.fetch = function (addUrl) {
        dime.resources.activity.fetch({ url: addUrl }).then(function (result) {
          dime.authorized = true;
          dime.modules.activity.applyFilter();
        });
      };

      dime.modules.activity.applyFilter = function () {
        scope.activities = dime.resources.activity;

        dime.events.emit('activity-view-collection-load', {
          collection: dime.resources.activity,
          scope: scope
        });
        _.forEach(dime.modules.activity.filters, function(filter) {
          dime.resources.activity.filter(filter);
        });
      };

      dime.modules.activity.fetch();

      return scope;
    },
    view: function (scope) {

      Mousetrap.bind(dime.modules.setting.get(
        dime.settings.activity.children.shortcuts.children.selectNext
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

      Mousetrap.bind(dime.modules.setting.get(
        dime.settings.activity.children.shortcuts.children.selectPrevious
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

      Mousetrap.bind(dime.modules.setting.get(
        dime.settings.activity.children.shortcuts.children.startStop
      ), function(e) {
        if (false === _.isUndefined(dime.modules.activity.selectedIdx)) {
          scope.activities[dime.modules.activity.selectedIdx].startStopTimeslice();
          m.redraw();
          return false;
        }
      });

      var addActivity = function addActivity () {
        dime.resources.activity.persist({
          description: t('(Click here to enter a description!)'),
          timeslices: []
        });
      };

      var list = scope.activities.map(dime.modules.activity.views.item);

      if (dime.resources.activity.pager.hasMore()) {
        list.push(m('div', m('a[href=#].btn.btn-block.margin-top', {
          onclick: function () {
            dime.resources.activity.pager.next();
            return false;
          }
        }, t('Show more'))));
      }

      var addButton = m('.fbtn-container',
        m('.fbtn-inner',
          m('a[href=#].fbtn.fbtn-red', {
            onclick: addActivity
          }, [
            m('span.fbtn-text', t('Add Activity')),
            m('span.icon.icon-add'),
          ])
        )
      );

      return [ m(".tile-wrap", [ list, addButton ]), ];
    },
    views: {}
  };

  dime.modules.activity.filters = {
    'default': function (activity) { return true; }
  };

  var getLatestUpdate = function (activity) {
    var latestUpdate = 0;
    if (false === _.isEmpty(activity.timeslices)) {
      return activity.timeslices.reduce(function (prevMax, item) {
        return prevMax < item.updatedAt ? item.updatedAt : prevMax;
      }, activity.updatedAt);
    }
    return activity.updatedAt;
  };

  // register route
  dime.routes['/'] = dime.modules.activity;

  // register resource
  dime.resources.activity = new dime.Collection({
    url: 'activity',
    model: dime.model.Activity,
    fail: dime.modules.login.redirect,
    success: dime.modules.login.success,
    sort: function (activityA, activityB) {
      var a = getLatestUpdate(activityA);
      var b = getLatestUpdate(activityB);

      if (a > b) {
        return -1;
      }
      if (a < b) {
        return 1;
      }
      return 0;
    }
  });

  // add settings section
  dime.settings.activity = {
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
            defaultValue: 'j',
          },
          selectPrevious: {
            title: 'Select previous activity',
            namespace: 'activity',
            name: 'shortcuts/selectPrevious',
            type: 'text',
            defaultValue: 'k',
          },
          startStop: {
            title: 'Start/stop activity',
            namespace: 'activity',
            name: 'shortcuts/startStop',
            type: 'text',
            defaultValue: 'space',
          }
        }
      }
    }
  }

})(dime, _, moment, m)
