'use strict';
(function (dime, m, _, t) {

  dime.events.on('activity-timeslice-table-head-view-after', function(context) {
    if (false == dime.configuration.get('activity', 'display/showIncome', false)) {
      return;
    }
    context.view.children[0].children[4] = context.view.children[0].children[3];
    context.view.children[0].children[3] = m('th.text-right', t('Income'));
  });

  dime.events.on('activity-timeslice-table-row-view-after', function(context) {
    if (false == dime.configuration.get('activity', 'display/showIncome', false)) {
      return;
    }
    var precision = dime.configuration.get('activity', 'display/incomePrecisionSeconds', 15*60);
    var income = context.activity.rate * Math.ceil(context.item.totalDuration(precision)) / 60 / 60;
    context.view.children[6] = context.view.children[5];
    context.view.children[5] = m('td.text-right', dime.helper.format.currency(income, '{number} €'));
  });

})(dime, m, _, t);