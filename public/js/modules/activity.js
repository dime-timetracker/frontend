'use strict';

(function (dime, doc, moment, m) {
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
      dime.store.add('timeslices', timeslice).done(function(newTimeslice) {
        currentActivity.timeslices.push(newTimeslice);
        m.redraw();
      });
    },
    stopTimeslice: function (currentActivity) {
      activity.stopTimer(currentActivity);
      currentActivity.timeslices.forEach(function (currentTimeslice) {
        if (_.isNull(currentTimeslice.stoppedAt) || _.isUndefined(currentTimeslice.stoppedAt)) {
          currentTimeslice.stoppedAt = moment().format('YYYY-MM-DD HH:mm:ss')
          currentTimeslice.url = dime.apiUrl + dime.schema.timeslices.url + '/' + currentTimeslice.id
          dime.store.update('timeslices', currentTimeslice)
        }
      });
    },
    toggleTimeslices: function (currentActivity) {
      return m("button.toggle-timeslices", {
        href: "#",
        onclick: function() {
          doc.getElementById("activity-" + currentActivity.id).classList.toggle("show-timeslices")
          return false;
        }
      }, "…")
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
    compareByTime: function (activityA, activityB) {
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
    stopTimer: function (currentActivity) {
      clearInterval(currentActivity.timer);
      console.log("stop");
      console.log(currentActivity.timer);
    },
    runTimer: function (currentActivity) {
      if (false == activity.isRunning(currentActivity)) {
        return;
      }
      var startedAt = activity.getRunningTimeslice(currentActivity).startedAt;
      currentActivity.timer = setInterval(function () {
        activity.updateTotalDuration(currentActivity);
      }, 1000);
    },
    getRunningTimeslice: function (currentActivity) {
      return currentActivity.timeslices.find(function (currentTimeslice) {
        return null == currentTimeslice.stoppedAt
      });
    },
    isRunning: function (currentActivity) {
      return currentActivity.timeslices.some(function (currentTimeslice) {
        return null == currentTimeslice.stoppedAt
      })
    },
    getTotalDuration: function (currentActivity) {
      return currentActivity.timeslices.reduce(function (prev, currentTimeslice) {
        if (_.isNumber(currentTimeslice.duration)) {
          return prev + currentTimeslice.duration;
        }
        return prev + moment().diff(moment(currentTimeslice.startedAt), "seconds");
      }, 0);
    },
    updateTotalDuration: function (currentActivity) {
      var duration = activity.getTotalDuration(currentActivity);
      ["start", "stop"].map(function(action) {
        var button = doc.getElementById(action + "-" + currentActivity.id)
        button.value = dime.helper.duration.format(duration, "seconds");
      });
      var runningTimeslice = activity.getRunningTimeslice(currentActivity);
      if (_.isObject(runningTimeslice)) {
        var el = doc.getElementById("timeslice-duration-" + runningTimeslice.id);
        duration = moment().diff(moment(runningTimeslice.startedAt), "seconds");
        el.innerHTML = dime.helper.duration.format(duration, "seconds");
      }
    },
    activityStartStopButton: function (currentActivity) {
      var running = activity.isRunning(currentActivity);
      if (running) {
        activity.runTimer(currentActivity);
      }
      return m("div", [
        m("input[type=button].start" + (running ? ".hidden" : "") + "#start-" + currentActivity.id, {
          onclick: function() {activity.startTimeslice(currentActivity)},
          value: dime.helper.duration.format(activity.getTotalDuration(currentActivity), 'seconds')
        }),
        m("input[type=button].stop" + (running ? "" : ".hidden") + "#stop-" + currentActivity.id, {
          onclick: function() {activity.stopTimeslice(currentActivity)},
          value: dime.helper.duration.format(activity.getTotalDuration(currentActivity), 'seconds')
        })
      ]);
    },
    activityView: function (currentActivity) {
      var customer = currentActivity.customer;
      var project  = currentActivity.project;
      var service  = currentActivity.service;
      var tags     = currentActivity.tags ? currentActivity.tags : [];
      return m("div.list-item.activity#activity-" + currentActivity.id, [
        activity.activityStartStopButton(currentActivity),
        activity.toggleTimeslices(currentActivity),
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
          m("div.tags", tags.map(function (tag) {
            var tagname = _.isString(tag) ? tag : tag.name;
            return m("span.tag", "#" + tagname);
          }))
        ]),
        m("table.timeslices", [
          m("tr", [
            m("th", "Start"),
            m("th", "End"),
            m("th", "Duration"),
          ])].concat(
            currentActivity.timeslices.map(dime.modules.timeslice.view)
          )
        )
      ])
    },
    view: function (ctrl) {
      var activities = dime.store.findAll('activities') || []
      activities.sort(activity.compareByTime);
      return m("div", [
        m("h2", "Activities")
      ].concat(activities.map(activity.activityView)))
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
})(dime, document, moment, m)
