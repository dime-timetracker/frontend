'use strict';

var m = require('mithril');
var t = require('../../lib/translation');
var duration = require('../utils/views/duration');

var component = {};

component.controller = function (args) {
  var scope = {};

  scope.isRunning = function () {
    return args.activity.isRunning();
  };

  scope.showDuration = function () {
    return duration(args.activity.totalDuration());
  };

  scope.action = function (e) {
    if (e) {
      e.preventDefault();
    }
    if (scope.isRunning()) {
      args.activity.stop();
    } else {
      args.activity.start();
    }
  };

  return scope;
};

component.view = function (scope) {
  var runs = scope.isRunning();
  var icon = runs ? '.icon.icon-stop' : '.icon.icon-play-arrow';
  var color = runs ? '.orange-text' : '';
  var title = runs ? 'Stop activity' : 'Start activity';

  var content = [
    m('span' + icon),
    ' ',
    scope.showDuration()
  ];

  return  m('a.btn.btn-flat' + color, { title: t(title), onclick: scope.action }, content);
};

module.exports = component;
