'use strict';
(function (dime, m, moment, _) {

  dime.timer = setInterval(m.redraw, 1000);
  
  var startStopButton = function(current, color, icon) {
    color = ".grey.lighten-1";
    icon = ".mdi-av-play-arrow";
    if (current.running()) {
      color = ".orange";
      icon = ".mdi-av-stop"
    }
    
    return  m("a.btn" + color, {href: '#', onclick: function() { current.startStopTimeslice() }}, [
      m("i" + icon),
      " ",
      dime.helper.duration.format(current.totalDuration(), 'seconds')
    ]);
  }

  dime.modules.activity.views.item = function (current) {
    var customer = current.customer;
    var project = current.project;
    var service = current.service;
    var tags = current.tags ? current.tags : [];

    var className = current.showTimeslices ? '' : '.hide';

    var p = [];
    if (customer) {
      p.push(m("span.bagde.customer", {title: customer.name}, "@" + customer.alias));
    } else {
      p.push(m("span.bagde.customer.empty", "@"));
    }

    if (project) {
      p.push(m("span.bagde.project", {title: project.name}, "/" + project.alias));
    } else {
      p.push(m("span.bagde.project.empty", "/"));
    }

    if (service) {
      p.push(m("span.bagde.service", {title: service.name}, ":" + service.alias));
    } else {
      p.push(m("span.badge.service.empty", ":"));
    }
    p.concat(tags.map(dime.modules.tag.views.item));
    
    var content = [
      m(".secondary-content", [
        m("a.btn.grey.lighten-1", {href: "#",
          onclick: function () {
            current.toggleTimeslices();
            return false;
          }
        }, m("i.mdi-action-schedule")),
        " ",
        startStopButton(current)
      ]),
      m("span.title", current.description),
      m("p", p),
      m("div.card-panel" + className, dime.modules.timeslice.views.table(current.timeslices))
    ];
   
    return m("div.collection-item.list-item.activity#activity-" + current.id, content);
  };

})(dime, m, moment, _);
