'use strict';
(function (dime, m, moment, _) {

  dime.timer = setInterval(m.redraw, 1000);
  
  var startStopButton = function(current) {
    var icon = ".icon.icon-play-arrow", color = "";
    if (current.running()) {
      icon = ".icon.icon-stop";
      color = ".orange-text";
    }
    
    return  m("a" + color, {href: '#', onclick: function() { current.startStopTimeslice() }}, [
      m("span" + icon),
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

    var badges = [];
    if (customer) {
      var incomplete = customer.name.length ? '' : '.incomplete';
      badges.push(
        m("span.badge.customer" + incomplete, {
          title: customer.name
        }, [
          "@" + customer.alias,
          dime.modules.customer.views.select(current)
        ])
      );
    } else {
      badges.push(m("span.badge.customer.empty", {title: "No customer selected"}, "@"));
    }

    if (project) {
      var incomplete = project.name.length ? '' : '.incomplete';
      badges.push(
        m("span.badge.project" + incomplete, {
          title: project.name
        }, [
          "/" + project.alias,
          dime.modules.project.views.select(current)
        ])
      );
    } else {
      badges.push(m("span.badge.project.empty", {title: "No project selected"}, "/"));
    }

    if (service) {
      var incomplete = service.name.length ? '' : '.incomplete';
      badges.push(
        m("span.badge.service" + incomplete, {
          title: service.name
        }, [
          ":" + service.alias,
          dime.modules.service.views.select(current)
        ])
      );
    } else {
      badges.push(m("span.badge.service.empty", {title: "No service selected"}, ":"));
    }
    

    return [
      m(".tile-action", 
        m("ul.nav.nav-list.pull-right", [
          m("li", m("a", { href: "#", onclick: function() { current.toggleTimeslices(); return false; }}, m("span.icon.icon-access-time"))),
          m("li", startStopButton(current)),
          m("li", m("a", { href: "#" }, m("span.icon.icon-delete")))
        ])
      ),
      m(".tile-inner", [
        m("span.text-overflow", {
          contenteditable: true,
          oninput: function(e) {
            current.updateDescription(e.target.textContent); return false;
          }
        }, current.description),
        badges.concat(tags.map(dime.modules.tag.views.item)),
      ]),
      m(".tile-sub" + className, dime.modules.timeslice.views.table(current.timeslices))
    ];
  };

})(dime, m, moment, _);
