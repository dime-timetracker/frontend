'use strict';

var m = require('mithril');
var t = require('../../../translation');
var helper = require('../../../core/helper');

module.exports = function (activity) {
  var icon = ".icon.icon-play-arrow", color = "";
  if (activity.running()) {
    icon = ".icon.icon-stop";
    color = ".orange-text";
  }

  return  m("a" + color, {
    href: '#',
    title: t(activity.running() ? 'stop activity' : 'start activity'),
    onclick: function () {
      activity.startStopTimeslice();
      return false;
    }
  }, [
    m("span" + icon),
    " ",
    helper.duration(activity.totalDuration(), 'seconds')
  ]);
};
