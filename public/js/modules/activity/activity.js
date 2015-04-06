'use strict';

(function (dime, doc, moment, m) {

  dime.modules.activity = {
    controller: function () {
      var scope = {};

      return scope;
    },
    view: function (scope) {
      var activities = dime.resources.activity.findAll() || [];
      return m(".tile-wrap", activities.map(dime.modules.activity.views.item));
    },
    views: {}
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
    title: "Activity",
    description: "Activity settings",
    children: {
      display: {
        title: "Display settings",
        children: {
          showRates: {
            title: "Show rates",
            default: false,
          },
          calculateActivityRateSum: {
            title: "Show rates",
            default: true,
            display: function() {return false;}
          },
          activityRateSumPrecision: {
            title: "Rate sum precision (in minutes)",
            onRead: function(value) { return value/60 },
            onWrite: function(value) { return value*60 },
            default: 15*60
          }
        }
      }
    }
  }

  // add menu item
  dime.menu.unshift({
    id: "activities",
    name: "Activities",
    route: "/",
    weight: -10
  });
})(dime, document, moment, m)
