'use strict';

var Collection = require('../Collection');
var Model = require('../model/Activity');
var lastUpdate = require('../helper/compare/activityLastUpdate');

var activities = new Collection({
  resourceUrl: 'activity',
  requestAttributes: {
    with: 100
  },
  model: Model,
  compare: function (a, b) {
    var result = 0;
    if (a > b) {
      result = -1;
    } else if (a < b) {
      result = 1;
    }
    return result;
  },
  compareKey: lastUpdate
});

module.exports = activities;