'use strict';

(function (dime, _, moment, m) {

  var t = dime.translate;

  dime.modules.activity = {
    controller: function () {
      var scope = {};

      return scope;
    },
    view: function (scope) {

      // first of all, we accept all of them
      dime.filters = {
        'default': {
          value: null,
          by: function (activity) { return true; }
        }
      };

      var activities = new dime.Collection({
        model: dime.model.Activity
      }, dime.resources.activity.findAll() || []);
      dime.events.emit('activity-view-collection-load', {
        collection: activities,
        scope: scope
      });
      activities = activities.findAll();

      var addActivity = function addActivity () {
        dime.resources.activity.persist({
          description: t('(Click here to enter a description!)'),
          timeslices: []
        });
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

      var filterButton = m('a[href=#].btn waves-button waves-effect', {
        onclick: function () { scope.showFilters = !scope.showFilters; return false; }
      }, [
        m('span.fbtn-text', t('Filter Activities')),
        m('span.icon.icon-filter-list')
      ]);

      var filterForm = m('#activity-filter',
        'Hier kommen die Filter hin...'
      );

      return m('div', [
        filterButton,
        scope.showFilters ? dime.modules.activity.views.filter(scope) : undefined,
        m(".tile-wrap", [
          activities.map(dime.modules.activity.views.item),
          addButton
        ]),
      ]);
    },
    views: {}
  };

  dime.modules.activity.filters = {
    'default': {
      value: null,
      by: function (activity) { return true; }
    }
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
  dime.resources.activity = new Resource({
    url: dime.apiUrl + "activity",
    model: dime.model.Activity,
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
  dime.resources.activity.fetch();

  // add settings section
  dime.settings.activity = {
    title: t('Activity'),
    description: t('Activity settings'),
    children: {
      display: {
        title: t('Display settings'),
        children: {}
      }
    }
  }

  // add menu item
  dime.menu.unshift({
    id: "activities",
    name: t('Activities'),
    route: "/",
    weight: -10
  });
})(dime, _, moment, m)
