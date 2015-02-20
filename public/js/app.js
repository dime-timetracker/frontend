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
        m("td", item.startedAt),
        m("td", item.stoppedAt)
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
    startTimeslice: function (activity) {
      var timeslice = {
        activity: activity.id,
        startedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      activity.timeslices.push(timeslice);
      store.add('timeslices', timeslice);
    },
    activityView: function (currentActivity) {
      return m("div", [
        m("p", currentActivity.description),
        m("input[type=button].start", {
          onclick: function() {activity.startTimeslice(currentActivity)}, value: "add"}),
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
