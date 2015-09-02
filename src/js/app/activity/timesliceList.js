'use strict';

var m = require('mithril');
var timesliceItem = require('./timesliceItem');

function controller (args) {
  var scope = {};

  scope.add = function (e) {
    if (e) {
      e.preventDefault();
    }
    args.activity.addTimeslice();
  };

  scope.items = args.activity.timeslices.map(function (timeslice) {
    return m.component(timesliceItem, {
      key: timeslice.uuid,
      activity: args.activity,
      timeslice: timeslice
    });
  });

  return scope;
}

function view (scope) {
  return m('.tiles', scope.items);
}

module.exports = {
  controller: controller,
  view: view
};
