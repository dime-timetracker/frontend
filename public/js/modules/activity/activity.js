'use strict';

(function (dime, _, moment, m) {

  dime.modules.activity = {
    controller: function () {
      var scope = {
        filter: {
          help: false,
          suggestions: []
        }
      };

      return scope;
    },
    view: function (scope) {

      var activities = new dime.Collection({
        model: dime.model.Activity
      }, dime.resources.activity.findAll() || []);
      dime.events.emit('activity-view-collection-load', {
        collection: activities,
        scope: scope
      });

      // filter activities
      _.forEach(dime.modules.activity.filters, function(filter) {
        activities.filter(filter);
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

      return [
        m(".tile-wrap", [
          activities.map(dime.modules.activity.views.item),
          addButton
        ]),
      ];
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

})(dime, _, moment, m)
