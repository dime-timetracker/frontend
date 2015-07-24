'use strict';

var create = require('lodash/object/create');
var extend = require('lodash/object/extend');
var isUndefined = require('lodash/lang/isUndefined');
var uuid = require('simple-uuid');

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

  extend(this, {
    uuid: uuid()
  }, data || {});
};

Model.prototype = create(Object.prototype, {constructor: Model});

Model.prototype.isNew = function () {
  return isUndefined(this.id);
};

module.exports = Model;
