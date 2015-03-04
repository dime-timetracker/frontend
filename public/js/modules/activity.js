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
          currentTimeslice.url = dime.apiUrl + schema.timeslices.url + '/' + currentTimeslice.id
          dime.store.update('timeslices', currentTimeslice)
        }
      })
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
          m("div.customer", customer ? "@" + customer.alias : ""),
          m("div.project", project ? "/" + project.alias : ""),
          m("div.service", service ? "/" + service.alias : ""),
          m("div.tags", tags.map(function (tag) { return m("span.tag", "#" + tag) }))
        ]),
        activity.activityStartStopButton(currentActivity),
        m("table", currentActivity.timeslices.map(dime.modules.timeslice.view))
      ])
    },
    view: function (ctrl) {
      var activities = dime.store.findAll('activities') || []
      return m("div", activities.map(activity.activityView))
    }
  }

  dime.modules.activity = activity;
  dime.routes['/'] = activity;
  dime.schema.activities = {url: 'activity'};
})(dime, moment, m)
