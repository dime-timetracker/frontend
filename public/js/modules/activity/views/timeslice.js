'use strict';
(function (dime, m, moment, _) {

  dime.modules.activity.views.timesliceItem = function (item) {
    var activity = this;
    var start = moment(item.startedAt);
    var tr = [];

    tr.push(m('td.start', dime.core.views.inputs.input('date', start.format('YYYY-MM-DD'))));
    tr.push(m('td.start', dime.core.views.inputs.input('time', start.format('HH:mm:ss'))));
    if (item.stoppedAt) {
      var stop = moment(item.stoppedAt);
      tr.push(m('td.stop', dime.core.views.inputs.input('time', stop.format('HH:mm:ss'))));
      tr.push(m('td.stop', dime.core.views.inputs.input('date', stop.format('YYYY-MM-DD'))));
    } else {
      tr.push(m('td.stop', ''));
      tr.push(m('td.stop', ''));
    }

    tr.push(m('td.duration#timeslice-duration-' + item.id, dime.helper.format.duration(item.totalDuration(), 'seconds')));
    tr.push(m('td.actions.text-right', [
      m('a.btn.btn-flat[href=#]', { onclick: function() { activity.removeTimeslice(item); return false; } }, m('span.icon.icon-delete'))
    ]));

    var rowView = m('tr#timeslice-' + item.id, tr);
    dime.events.emit('activity-timeslice-table-row-view-after', {view: rowView, item: item, activity: activity});
    return rowView;
  };

  dime.modules.activity.views.timeslices = function (current) {
    var items = current.timeslices || [];

    var tableHead = m('thead',
      m('tr', [
        m('th', {colspan: 2}, t('Start')),
        m('th', {colspan: 2}, t('End')),
        m('th', t('Duration')),
        m('th.text-right', m('a.btn.btn-flat[href=#]', { onclick: function clickTimesliceAdd (e) { current.addTimeslice(); return false; } }, m('span.icon.icon-add')))
      ])
    );
    dime.events.emit('activity-timeslice-table-head-view-after', {view: tableHead, activity: current});

    return m('table.table.table-inline.table-bordered.table-hover', [
      tableHead,
      m('tbody', items.map(dime.modules.activity.views.timesliceItem, current))
    ]);
  };
})(dime, m, moment, _);
