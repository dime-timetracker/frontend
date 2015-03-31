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

    var badges = [
      dime.modules.customer.views.badge(current),
      dime.modules.project.views.badge(current),
      dime.modules.service.views.badge(current),
    ];


    var hasTags = 0 < tags.length;
    var tagClass = hasTags ? "" : ".empty";
    badges.push(m("span.tag-badges" + tagClass, {
      title: hasTags ? "Click to edit tags" : "Click to add tags"
    }, hasTags
      ? tags.map(dime.modules.tag.views.item)
      : m("span.badge.tag.incomplete", "#")
    ));

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
        badges
      ]),
      m(".tile-sub" + className, dime.modules.timeslice.views.table(current.timeslices))
    ];
  };

})(dime, m, moment, _);
