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
        m("td.duration#timeslice-duration-" + item.id, dime.helper.duration.format(item.duration, "seconds"))
      ])
    },
    table: function (items) {
      var items = items || [];
      return m("table.timeslices", [
        m("tr", [
          m("th", "Start"),
          m("th", "End"),
          m("th", "Duration"),
        ])].concat(
          items.map(dime.modules.timeslice.views.item)
        )
      );
    }
  };

  // register resource
  dime.resources.timeslice = new Resource({
    url: dime.apiUrl + "timeslice"
  });

})(dime, m, moment)
