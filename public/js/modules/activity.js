'use strict';

(function (dime, moment, m) {
  var activity = {
    model: function (data) {
      return {
        description: m.prop(data.description),
        timeslices: m.prop(data.timeslices.map(dime.modules.timeslice.model))
      }
    },
    controller: function () {
      dime.store.get('activities').done(function(activities) {
        m.redraw()
      })
    },
    startTimeslice: function (currentActivity) {
      var timeslice = {
        activity: currentActivity.id,
        startedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      currentActivity.timeslices.push(timeslice);
      dime.store.add('timeslices', timeslice);
    },
    stopTimeslice: function (currentActivity) {
      currentActivity.timeslices.forEach(function (currentTimeslice) {
        if (null == currentTimeslice.stoppedAt) {
          currentTimeslice.stoppedAt = moment().format('YYYY-MM-DD HH:mm:ss')
          currentTimeslice.url = dime.apiUrl + dime.schema.timeslices.url + '/' + currentTimeslice.id
          dime.store.update('timeslices', currentTimeslice)
        }
      })
    },
    getLatestUpdate: function (activity) {
      var latestUpdate = 0;
      if (false == _.isEmpty(activity.timeslices)) {
        return activity.timeslices.reduce(function (prevMax, item) {
          return prevMax < item.updatedAt ? item.updatedAt : prevMax;
        }, activity.updatedAt);
      }
      return activity.updatedAt;
    },
    compare: function (activityA, activityB) {
      var a = activity.getLatestUpdate(activityA);
      var b = activity.getLatestUpdate(activityB);

      if (a > b) {
        return -1;
      }
      if (a < b) {
        return 1;
      }
      return 0;
    },
    isRunning: function (currentActivity) {
      return currentActivity.timeslices.some(function (currentTimeslice) {
        return null == currentTimeslice.stoppedAt
      })
    },
    activityStartStopButton: function (currentActivity) {
      var running = activity.isRunning(currentActivity)
      return m("div", [
        m("input[type=button].start" + (running ? ".hidden" : ""), {
          onclick: function() {activity.startTimeslice(currentActivity)}, value: "run"}),
        m("input[type=button].stop" + (running ? "" : ".hidden"), {
          onclick: function() {activity.stopTimeslice(currentActivity)}, value: "stop"})
      ])
    },
    activityView: function (currentActivity) {
      var customer = currentActivity.customer;
      var project  = currentActivity.project;
      var service  = currentActivity.service;
      var tags     = currentActivity.tags ? currentActivity.tags : [];
      return m("div.activity", [
        m("p", [
          m("div.description", currentActivity.description),
          customer
            ? m("div.customer", {title: customer.name}, "@" + customer.alias)
            : m("div.customer.empty"),
          project
            ? m("div.project", {title: project.name}, "/" + project.alias)
            : m("div.project.empty"),
          service
            ? m("div.service", {title: service.name}, ":" + service.alias)
            : m("div.service.empty"),
          m("div.tags", tags.map(function (tag) { return m("span.tag", "#" + tag) }))
        ]),
        activity.activityStartStopButton(currentActivity),
        m("table", currentActivity.timeslices.map(dime.modules.timeslice.view))
      ])
    },
    view: function (ctrl) {
      var activities = dime.store.findAll('activities') || []
      activities.sort(activity.compare);
      return m("div", activities.map(activity.activityView))
    }
  }

  // register module
  dime.modules.activity = activity;

  // register route
  dime.routes['/'] = activity;

  // register schema
  dime.schema.activities = {url: "activity"};

  // add menu item
  dime.menu.unshift({
    id: "activities",
    name: "Activities",
    route: "/",
    weight: -10
  });
})(dime, moment, m)
