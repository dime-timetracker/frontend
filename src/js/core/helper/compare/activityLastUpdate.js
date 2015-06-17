'use strict';

var _ = require('lodash');
var moment = require('moment');

/**
 * Compare function to sort a collection with activities on last update.
 *
 * @param {Activity} activity
 * @returns {integer}
 */
module.exports = function (activity) {
  var result = parseInt(moment(activity.updatedAt || 'now').format('x'));
  if (false === _.isEmpty(activity.timeslices)) {
    result = activity.timeslices.reduce(function (prevMax, item) {
      var timestamp = parseInt(moment(item.updatedAt).format('x'));
      return prevMax < timestamp ? timestamp : prevMax;
    }, result);
  }
  return result;
};