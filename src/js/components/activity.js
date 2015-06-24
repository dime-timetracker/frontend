'use strict';

var m = require('mithril');
var t = require('../translation');
var activities = require('../core/collection/activities');

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
  return m('.tile-wrap', [ list, buttonView(t('Add Activity'), '', scope.add) ]);
}

module.exports = {
  controller: function () {
    // FIXME Pager settings ...
    activities.fetch();

    var scope = {
      collection: activities,
    };

    return scope;
  },
  view: function (scope) {
    return m('.activities', [ promptView(scope), activityListView(scope) ]);
  }
};
