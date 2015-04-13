'use strict';
(function (dime, m, _) {

  dime.events.on('activity-item-actions-view-after', function(context) {
    if (false == dime.modules.setting.get('activity', 'display/showRates', false)
      || false == dime.modules.setting.get('activity', 'display/calculateActivityRateSum', false)
    ) {
      return;
    }

    var children = [];
    var precision = dime.modules.setting.get('activity', 'display/activityRateSumPrecision', 15*60)
    _.forEach(context.view.children, function(child, idx) {
      if (idx === 2) {
        children.push(m("li.rateSum", m("a", {
          href: '#',
          onclick: function() {return false;},
          title: context.item.rate + "€/h"
        }, dime.helper.number.formatCurrency(context.item.getRateSum(precision), '{number} €'))))
      }
      children.push(child);
    });
    context.view.children = children;
  });

  dime.settings.activity.children.display.children.showRates = {
    title: "Show rates",
    namespace: "activity",
    name: "display/showRates",
    type: "boolean",
    default: false
  };

  dime.settings.activity.children.display.children.calculateActivityRateSum = {
    title: "Show rate sum for activities",
    namespace: "activity",
    name: "display/calculateActivityRateSum",
    default: true,
    type: "boolean",
    onRender: function() {
      var depends = dime.settings.activity.children.display.children.showRates;
      return true == dime.modules.setting.get(
        depends.namespace,
        depends.name,
        depends.default
      );
    },
    display: function() {return false;}
  };

  dime.settings.activity.children.display.children.activityRateSumPrecision = {
    title: "Rate sum precision (in minutes)",
    description: "Round each timeslice duration according to this precision",
    namespace: "activity",
    name: "display/activityRateSumPrecision",
    type: "number",
    onRead: function(value) { return value/60; },
    onRender: function() {
      var depends = [
        dime.settings.activity.children.display.children.showRates,
        dime.settings.activity.children.display.children.calculateActivityRateSum
      ];
      return _.every(depends, function(depend) {
        return true == dime.modules.setting.get(
          depend.namespace,
          depend.name,
          depend.default
        );
      });
    },
    onWrite: function(value) { return value*60; },
    default: 15*60
  };

})(dime, m, _);
