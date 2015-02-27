'use strict';

(function (document, moment, m) {

  var dimeApiUrl = 'http://dime-laravel-4.dev/api/'

  var store = new Amygdala({
    config: {
      apiUrl: dimeApiUrl,
      idAttribute: 'id',
      localStorage: false
    },
    schema: {
      activities: {
        url: 'activity'
      },
      timeslices: {
        url: 'timeslice'
      }
    }
  })

  var timeslice = {
    model: function (data) {
      return {
        start: m.prop(moment(data.startedAt)),
        stop: m.prop(moment(data.stoppedAt))
      }
    },
    view: function (item) {
      return m("tr", [
        m("td.start", item.startedAt),
        m("td.stop", item.stoppedAt)
      ])      
    }
  }
  
  timeslice.model.test = function () {
    console.log('test')
  }
  
  var activity = {
    model: function (data) {
      return {
        description: m.prop(data.description),
        timeslices: m.prop(data.timeslices.map(timeslice.model))
      }
    },
    controller: function () {
      store.get('activities').done(function(activities) {
        m.redraw()
      })
    },
    startTimeslice: function (currentActivity) {
      var timeslice = {
        activity: currentActivity.id,
        startedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      currentActivity.timeslices.push(timeslice);
      store.add('timeslices', timeslice);
    },
    stopTimeslice: function (currentActivity) {
      currentActivity.timeslices.forEach(function (timeslice) {
        if (null == timeslice.stoppedAt) {
          timeslice.stoppedAt = moment().format('YYYY-MM-DD HH:mm:ss')
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
        m("table", currentActivity.timeslices.map(timeslice.view))
      ])
    },
    view: function (ctrl) {
      var activities = store.findAll('activities') || []
      return m("div", activities.map(activity.activityView))
    }
  }
  
  m.module(document.getElementById("main"), activity)

})(document, moment, m)
