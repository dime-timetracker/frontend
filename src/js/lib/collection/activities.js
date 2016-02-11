'use strict';

var lastUpdate = require('../helper/compare/activityLastUpdate');

module.exports = {
  collection: [],
  requestAttributes: {
    with: 100
  },
  resourceUrl: 'activity',
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
};
