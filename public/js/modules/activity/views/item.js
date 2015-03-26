'use strict';
(function (dime, m, moment, _, doc) {
  
  var startStopButton = function(current) {
    var isRunning = current.running();
    if (isRunning) {
      //runTimer(current);
    }
    return m("div", [
      m("input[type=button].start" + (isRunning ? ".hidden" : "") + "#start-" + current.id, {
        onclick: function() {current.startTimeslice()},
        value: dime.helper.duration.format(current.totalDuration(), 'seconds')
      }),
      m("input[type=button].stop" + (isRunning ? "" : ".hidden") + "#stop-" + current.id, {
        onclick: function() {current.stopTimeslice()},
        value: dime.helper.duration.format(current.totalDuration(), 'seconds')
      })
    ]);
  }

  dime.timer = setInterval(m.redraw, 1000);
  
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
        current.toggleTimeslices();
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

    var className = current.showTimeslices ? 'show-timeslices' : 'hide-timeslices';
    
    return m("div.list-item.activity#activity-" + current.id + '.' + className, content);
  };
  
})(dime, m, moment, _, document);
