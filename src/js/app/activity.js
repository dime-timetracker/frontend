'use strict';

var m = require('mithril');
var t = require('../lib/translation');
var activities = require('../lib/collection/activities');

var configuration = require('../lib/configuration');
configuration.addSection(require('./shell/config'));
configuration.addSection(require('./activity/config'));

var buttonView = require('./utils/views/button');
var card = require('./utils/views/card/default');
var tile = require('./utils/views/tile');

var shellActivities = require('./shell/activity');
var shellFilter = require('./shell/filter');
var itemView = require('./activity/item');

function activityListView (scope) {
  var tileWrap = [];

  tileWrap.push(scope.collection.map(function (activity) {
    return m.component(itemView, {
      activity: activity,
      key: activity.uuid,
      collection: scope.collection
    });
  }, scope));

  if (scope.collection.hasMore()) {
    tileWrap.push(m('a.margin-top.btn.btn-block[href=#]', { onclick: function (e) {
      if (e) {
        e.preventDefault();
      }
      scope.collection.fetchNext();
    } }, t('Show more')));
  }

  tileWrap.push(buttonView('Add Activity', '/', scope.add));

  return m('.tile-wrap', tileWrap);
}

function controller () {
  var scope = {
    collection: activities
  };

  scope.add = function (e) {
    if (e) {
      e.preventDefault();
    }
    scope.collection.add({});
  };

  return scope;
}

function view (scope) {
  return m('.activities', [
    card(m.component(shellActivities, scope)),
    m('.filter', card(m.component(shellFilter, scope))),
    activityListView(scope)
  ]);
}

module.exports = {
  controller: controller,
  view: view
};
