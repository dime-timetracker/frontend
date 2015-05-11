'use strict';
(function (dime, m, _) {

  var calculateTimesliceIncome = function (timeslice, precisionSeconds) {
    return timeslice.totalDuration(precisionSeconds);
  }

  var calculateActivityIncome = function (activity, precisionSeconds) {
    var sum = activity.rate * activity.timeslices.reduce(function (prev, timeslice) {
      return prev + calculateTimesliceIncome(timeslice, precisionSeconds);
    }, 0) / 60 / 60;
    return sum;
  }

  var formatCurrency = function (amount) {
    return dime.helper.number.formatCurrency(amount, '{number} €');
  }

  var isDependencyMet = function (dependency) {
    return true == dime.configuration.get(dependency);
  }

  var areDependenciesMet = function (dependencies) {
    return _.every(dependencies, isDependencyMet);
  }

  dime.events.on('activity-item-actions-view-after', function(context) {
    if (false == dime.configuration.get('activity', 'display/showIncome', false)
      || false == dime.configuration.get('activity', 'display/showActivityIncome', false)
    ) {
      return;
    }

    var children = [];
    var precisionSeconds = dime.configuration.get(
      dime.configuration.activity.children.display.children.incomePrecisionSeconds
    );
    _.forEach(context.view.children, function(child, idx) {
      if (idx === 2) {
        children.push(m("li.income", {
          style: 'text-align: right; width: 120px'  // FIXME this needs to be moved to some CSS or whatever
        }, m("a", {
          href: '#',
          onclick: function() {return false;},
          title: context.item.rate + "€/h"
        }, formatCurrency(calculateActivityIncome(context.item, precisionSeconds)))));
      }
      children.push(child);
    });
    context.view.children = children;
  });

  dime.configuration.activity.children.display.children.showIncome = {
    title: "Show Income",
    namespace: "activity",
    name: "display/showIncome",
    type: "boolean",
    defaultValue: false
  };

  dime.configuration.activity.children.display.children.showActivityIncome = {
    title: "Show income for activities",
    namespace: "activity",
    name: "display/showActivityIncome",
    defaultValue: true,
    type: "boolean",
    onRender: function() {
      return isDependencyMet(
        dime.configuration.activity.children.display.children.showIncome
      );
    },
    display: function() {return false;}
  };

  dime.configuration.activity.children.display.children.incomePrecisionSeconds = {
    title: "Income Precision (in minutes)",
    description: "Round each timeslice duration according to this precision",
    namespace: "activity",
    name: "display/incomePrecisionSeconds",
    type: "number",
    onRead: function(value) { return value/60; },
    onRender: function() {
      return areDependenciesMet([
        dime.configuration.activity.children.display.children.showIncome,
        dime.configuration.activity.children.display.children.showActivityIncome
      ]);
    },
    onWrite: function(value) { return value*60; },
    defaultValue: 15*60
  };

})(dime, m, _);
