'use strict';

var m = require('mithril');
var activities = require('../lib/collection/activities');

var configuration = require('../lib/configuration');
configuration.addSection(require('./shell/config'));
configuration.addSection(require('./activity/config'));

var buttonView = require('./utils/views/button');
var card = require('./utils/views/card/default');

var shellActivities = require('./shell/activity');
var shellFilter = require('./shell/filter');
var item = require('./activity/item');

function activityListView (scope) {
  var list = scope.collection.map(function (activity) {
    return m.component(item, activity, scope.collection);
  }, scope);
  return m('.tile-wrap', [ list, buttonView('Add Activity', '/', scope.add) ]);
}

var component = {
  controller: function () {
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
  },
  view: function (scope) {
    return m('.activities', [
      card(m.component(shellActivities, scope)),
      m('.filter', card(m.component(shellFilter, scope))),
      activityListView(scope)
    ]);
  }
};

module.exports = component;
