'use strict';
(function (dime, m, moment, _) {

  dime.modules.activity.views.timesliceItem = function (item) {
    item = dime.model.Timeslice(item);
    var activity = this;
    var rowView = m("tr#timeslice-" + item.id, [
      m("td.start", moment(item.startedAt).format("DD.MM.YYYY HH:mm:ss")),
      m("td.stop", item.stoppedAt ? moment(item.stoppedAt).format("DD.MM.YYYY HH:mm:ss") : ""),
      m("td.duration#timeslice-duration-" + item.id, dime.helper.duration.format(item.totalDuration(), "seconds")),
      m("td.actions.right-align", [
        m("a.btn.btn-flat[href=#]", { onclick: function() { activity.removeTimeslice(item); return false; } }, m("span.icon.icon-delete"))
      ])
    ]);
    dime.events.emit('activity-timeslice-table-row-view-after', {view: rowView, item: item, activity: activity});
    return rowView;
  };

  dime.modules.activity.views.timeslices = function (current) {
    var items = current.timeslices || [];

    var tableHead = m("thead",
      m("tr", [
        m("th", "Start"),
        m("th", "End"),
        m("th", "Duration"),
        m("th.right-align", m("a.btn.btn-flat[href=#]", m("span.icon.icon-add")))
      ])
    );
    dime.events.emit('activity-timeslice-table-head-view-after', {view: tableHead, activity: current});

    return m("table.bordered.responsive-table", [
      tableHead,
      m("tbody", items.map(dime.modules.activity.views.timesliceItem, current))
    ]);
  };
})(dime, m, moment, _);
