'use strict';

var _ = require('lodash');

/**
 * Model
 *
 * - extends json data with prototype function
 * - connected to persistence adapter
 * - are part of an collection
 * @param {Object} data plain data object
 */
var Model = function (data) {
  if (!(this instanceof Model)) {
    return new Model();
  }

  _.extend(this, {}, data || {});
};

Model.prototype = {};
Model.prototype.constructor = Model;

Model.prototype.isNew = function () {
  return _.isUndefined(this.id);
};

module.exports = Model;