'use strict';

var m = require('mithril');
var t = require('../../translation');
var helper = require('../../core/helper');

var component = {};

component.controller = function (activity) {
  var scope = {};

  scope.running = function () {
    return activity.running();
  };

  scope.duration = function () {
    return helper.duration(activity.totalDuration(), 'seconds');
  }

  scope.action = function (e) {
    e.preventDefault();
    activity.startStopTimeslice();
  };

  return scope;
};

component.view = function (scope) {
  var runs = scope.running();
  var icon = (runs) ? ".icon.icon-stop" : ".icon.icon-play-arrow";
  var color = (runs) ? ".orange-text" : "";
  var title = (runs) ? 'Stop activity' : 'Start activity';

  var content = [
    m("span" + icon),
    " ",
    scope.duration()
  ];

  return  m("button.btn.btn-flat" + color, { title: t(title), onclick: scope.action }, content);
};

module.exports = component;
