'use strict';

(function (dime, doc, moment, m) {
  
  dime.modules.activity = {
    controller: function () {
      var scope = {};
      
      return scope;
    },
    view: function (scope) {
      var activities = dime.resources.activity.findAll() || [];
      return m("div", [
        m("h2", "Activities")
      ].concat(activities.map(dime.modules.activity.views.item)));
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
  
//  var foo = {
//    model: function (data) {
//      return {
//        description: m.prop(data.description),
//        timeslices: m.prop(data.timeslices.map(dime.modules.timeslice.model))
//      }
//    },
//    controller: function () {
//      
//      dime.store.get('activities').done(function(activities) {
//        m.redraw()
//      })
//    },
//    startTimeslice: function (currentActivity) {
//      var timeslice = {
//        activity: currentActivity.id,
//        startedAt: moment().format('YYYY-MM-DD HH:mm:ss')
//      };
//      dime.store.add('timeslices', timeslice).done(function(newTimeslice) {
//        currentActivity.timeslices.push(newTimeslice);
//        m.redraw();
//      });
//    },
//    stopTimeslice: function (currentActivity) {
//      activity.stopTimer(currentActivity);
//      currentActivity.timeslices.forEach(function (currentTimeslice) {
//        if (_.isNull(currentTimeslice.stoppedAt) || _.isUndefined(currentTimeslice.stoppedAt)) {
//          currentTimeslice.stoppedAt = moment().format('YYYY-MM-DD HH:mm:ss')
//          currentTimeslice.url = dime.apiUrl + dime.schema.timeslices.url + '/' + currentTimeslice.id
//          dime.store.update('timeslices', currentTimeslice)
//        }
//      });
//    },
//    toggleTimeslices: function (currentActivity) {
//      return 
//    },
//    getLatestUpdate: function (activity) {
//      var latestUpdate = 0;
//      if (false == _.isEmpty(activity.timeslices)) {
//        return activity.timeslices.reduce(function (prevMax, item) {
//          return prevMax < item.updatedAt ? item.updatedAt : prevMax;
//        }, activity.updatedAt);
//      }
//      return activity.updatedAt;
//    },
//    
//    stopTimer: function (currentActivity) {
//      clearInterval(currentActivity.timer);
//      console.log("stop");
//      console.log(currentActivity.timer);
//    },
//    view: function (ctrl) {
//      var activities = dime.store.findAll('activities') || []
//      activities.sort(activity.compareByTime);
//      return m("div", [
//        m("h2", "Activities")
//      ].concat(activities.map(activity.activityView)))
//    }
//  }

  // register module
  

  // register route
  dime.routes['/'] = dime.modules.activity;

  // register resource
  dime.resources.activity = new Resource({
    url: dime.apiUrl + "activity",
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
  
  // add menu item
  dime.menu.unshift({
    id: "activities",
    name: "Activities",
    route: "/",
    weight: -10
  });
})(dime, document, moment, m)
