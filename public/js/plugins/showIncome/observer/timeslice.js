'use strict';
(function (dime, m, _) {

  dime.events.on('activity-timeslice-table-head-view-after', function(context) {
    if (false == dime.modules.setting.get('activity', 'display/showRates', false)) {
      return;
    }
    context.view.children[0].children[4] = context.view.children[0].children[3];
    context.view.children[0].children[3] = m("th.text-right", "Income");
  });

  dime.events.on('activity-timeslice-table-row-view-after', function(context) {
    if (false == dime.modules.setting.get('activity', 'display/showRates', false)) {
      return;
    }
    var precision = dime.modules.setting.get('activity', 'display/activityRateSumPrecision', 15*60)
    var income = context.activity.rate * Math.ceil(context.item.totalDuration(precision)) / 60 / 60;
    context.view.children[4] = context.view.children[3];
    context.view.children[3] = m("td.text-right", dime.helper.number.formatCurrency(income, '{number} €'));
  });

})(dime, m, _);