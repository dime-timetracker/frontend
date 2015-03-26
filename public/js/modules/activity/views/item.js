'use strict';
(function (dime, m, moment, _, doc) {
  
  var running = function (current) {
    return current.timeslices.some(function (timeslice) {
      return null === timeslice.stoppedAt;
    });
  };
  
  var getRunningTimeslice = function (current) {
    return current.timeslices.find(function (timeslice) {
      return null === timeslice.stoppedAt;
    });
  };
  
  var getTotalDuration = function (current) {
    return current.timeslices.reduce(function (prev, timeslice) {
      if (_.isNumber(timeslice.duration)) {
        return prev + timeslice.duration;
      }
      return prev + moment().diff(moment(timeslice.startedAt), "seconds");
    }, 0);
  };
  
  var updateTotalDuration = function (current) {
    var duration = getTotalDuration(current);
    ["start", "stop"].map(function(action) {
      var button = doc.getElementById(action + "-" + current.id)
      button.value = dime.helper.duration.format(duration, "seconds");
    });
    var runningTimeslice = getRunningTimeslice(current);
    if (_.isObject(runningTimeslice)) {
      var el = doc.getElementById("timeslice-duration-" + runningTimeslice.id);
      duration = moment().diff(moment(runningTimeslice.startedAt), "seconds");
      el.innerHTML = dime.helper.duration.format(duration, "seconds");
    }
  };
    
  var runTimer = function (current) {
    if (running(current)) {
      var startedAt = getRunningTimeslice(current).startedAt;
      current.timer = setInterval(function () {
        updateTotalDuration(current);
      }, 1000);
    }
  };
  
  var startStopButton = function(current) {
    var isRunning = running(current);
    if (isRunning) {
      runTimer(current);
    }
    return m("div", [
      m("input[type=button].start" + (isRunning ? ".hidden" : "") + "#start-" + current.id, {
        onclick: function() {activity.startTimeslice(current)},
        value: dime.helper.duration.format(getTotalDuration(current), 'seconds')
      }),
      m("input[type=button].stop" + (isRunning ? "" : ".hidden") + "#stop-" + current.id, {
        onclick: function() {activity.stopTimeslice(current)},
        value: dime.helper.duration.format(getTotalDuration(current), 'seconds')
      })
    ]);
  }
  
  dime.modules.activity.views.item = function (current) {
    var customer = current.customer;
    var project  = current.project;
    var service  = current.service;
    var tags     = current.tags ? current.tags : [];
    
    var content = [];
    
    // Start-Stop-Button
    content.push(startStopButton(current));
    content.push(m("button.toggle-timeslices", {
      href: "#",
      onclick: function() {
        doc.getElementById("activity-" + current.id).classList.toggle("show-timeslices")
        return false;
      }
    }, "…"));
    
    var p = [];
    
    p.push(m("div.description", current.description));
    
    if (customer) {
      p.push(m("div.customer", {title: customer.name}, "@" + customer.alias));
    } else {
      p.push(m("div.customer.empty"));
    }
    
    if (project) {
      p.push(m("div.project", {title: project.name}, "/" + project.alias));
    } else {
      p.push(m("div.project.empty"));
    }
    
    if (service) {
      p.push(m("div.service", {title: service.name}, ":" + service.alias));
    } else {
      p.push(m("div.service.empty"));
    }
    
    p.push(m("div.tags", tags.map(dime.modules.tag.views.item)));
    
    content.push(m("p", p));
    content.push(dime.modules.timeslice.views.table(current.timeslices));
    
    return m("div.list-item.activity#activity-" + current.id, content);  
  };
  
})(dime, m, moment, _, document);