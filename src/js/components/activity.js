'use strict';

var m = require('mithril');
var t = require('../translation');
var activities = require('../core/collection/activities');

var configuration = require('../core/configuration');
configuration.addSection(require('./prompt/config'));
configuration.addSection(require('./activity/config'));

var buttonView = require('../core/views/button');
var itemView = require('./activity/views/item');
var grid = require('../core/views/grid');
var card = require('../core/views/card');

function promptView (scope) {
  return card(grid(
    m.component(require('./prompt/activity'), scope),
    m.component(require('./prompt/filter'), scope)
  ));
}

function activityListView (scope) {
  var list = scope.collection.map(itemView, scope);
  return m('.tile-wrap', [ list, buttonView('Add Activity', '/', scope.add) ]);
}

module.exports = {
  controller: function () {
    // FIXME move to init process
    activities.fetch();

    var scope = {
      collection: activities
    };

    scope.add = function (e) {
      if (e) e.preventDefault();
      scope.collection.add({});
    };

    return scope;
  },
  view: function (scope) {
    return m('.activities', [ promptView(scope), activityListView(scope) ]);
  }
};
