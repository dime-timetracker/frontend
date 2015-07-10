'use strict';

var m = require('mithril');
var views = {
  description: require('./itemDescription'),
  actions: require('./itemActions'),
  timeslices:  require('./timeslice')
};

var badge = require('./badge');

var view = function (activity, idx) {
  var content = [];
  content.push(m('.tile-action.tile-action-show', views.actions(activity)));

  var inner = [];
  inner.push(views.description(activity));

  inner.push(m.component(badge, activity.customer));
  inner.push(m.component(badge, activity.project));
  inner.push(m.component(badge, activity.service));

  content.push(m('.tile-inner', inner));

  if (activity.showTimeslices) {
    content.push(m('.tile-sub', views.timeslices(activity)));
  }

  return m('.tile', content);
};

module.exports = view;
