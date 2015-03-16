'use strict';

(function (dime, moment, m) {
  var timeslice = {
    model: function (data) {
      return {
        start: m.prop(moment(data.startedAt)),
        stop: m.prop(moment(data.stoppedAt))
      }
    },
    view: function (item) {
      return m("tr#timeslice-" + item.id, [
        m("td.start", moment(item.startedAt).format("DD.MM.YYYY HH:mm:ss")),
        m("td.stop", item.stoppedAt ? moment(item.stoppedAt).format("DD.MM.YYYY HH:mm:ss") : ""),
        m("td.duration#timeslice-duration-" + item.id, dime.helper.duration.format(item.duration, "seconds"))
      ])      
    }
  }

  dime.modules.timeslice = timeslice;
  dime.routes["/timeslice"] = timeslice;
  dime.schema.timeslices = {url: 'timeslice'};
})(dime, moment, m)
