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
      return m("tr", [
        m("td.start", item.startedAt),
        m("td.stop", item.stoppedAt)
      ])      
    }
  }

  dime.modules.timeslice = timeslice;
  dime.routes["/timeslice"] = timeslice;
  dime.schema.timeslices = {url: 'timeslice'};
})(dime, moment, m)
