'use strict';

(function (dime, m, moment) {

  dime.modules.timeslice = {
    views: {}
  };

  dime.modules.timeslice.views = {
    item: function (item) {
      return m("tr#timeslice-" + item.id, [
        m("td.start", moment(item.startedAt).format("DD.MM.YYYY HH:mm:ss")),
        m("td.stop", item.stoppedAt ? moment(item.stoppedAt).format("DD.MM.YYYY HH:mm:ss") : ""),
        m("td.duration#timeslice-duration-" + item.id, dime.helper.duration.format(item.duration, "seconds")),
        m("td.actions.right-align", [
          m("a.btn.btn-flat[href=#]", { onclick: function() { dime.resources.timeslice.remove(item); return false; } }, m("span.icon.icon-delete"))
        ])
      ]);
    },
    table: function (items) {
      var items = items || [];
      return m("table.bordered.responsive-table", [
        m("thead",
          m("tr", [
            m("th", "Start"),
            m("th", "End"),
            m("th", "Duration"),
            m("th.right-align", m("a.btn.btn-flat", { href: "#" }, m("span.icon.icon-add")))
          ])
        ),
        m("tbody", items.map(dime.modules.timeslice.views.item))
      ]);
    }
  };

  // register resource
  dime.resources.timeslice = new Resource({
    url: dime.apiUrl + "timeslice",
    empty: {
      activity: null,
      startedAt: null,
      stoppedAt: null,
      duration: 0
    }
  });

})(dime, m, moment);
