'use strict';

var m = require('mithril');
var views = {
  description: require('./itemDescription'),
  actions: require('./itemActions'),
  timeslices:  require('./timeslice')
};

var view = function (activity, idx) {
  var content = [];

  // TODO Badges Customer, Project, Service, Tags

  content.push(m('.tile-action.tile-action-show', views.actions(activity)));
  content.push(m('.tile-inner', views.description(activity)));

  if (activity.showTimeslices) {
    content.push(m('.tile-sub', views.timeslices(activity)));
  }

  return m('.tile', content);
};

module.exports = view;