'use strict';

var m = require('mithril');
var t = require('../translation');
var activities = require('../core/collection/activities');

var configuration = require('../core/configuration');
configuration.addSection(require('./shell/config'));
configuration.addSection(require('./activity/config'));

var buttonView = require('../core/views/button');
var item = require('./activity/item');
var grid = require('../core/views/grid');
var card = require('../core/views/card');

function shellView (scope) {
  return card(grid(
    m.component(require('./shell/filter'), scope)
  ));
}

function consoleView (scope) {
  return m('div.console', card(grid(m.component(require('./shell/activity'), scope))));
}

function activityListView (scope) {
  var list = scope.collection.map(function (activity) {
    return m.component(item, activity);
  }, scope);
  return m('.tile-wrap', [ list, buttonView('Add Activity', '/', scope.add) ]);
}

var component = {
  controller: function () {
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
    return m('.activities', [ shellView(scope), activityListView(scope), consoleView(scope) ]);
  }
};

module.exports = component;
