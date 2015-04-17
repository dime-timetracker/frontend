/**
 * Collection is a array of objects.
 *
 * - can find objects by identifier
 * - can find objects by parameter
 *
 * - can have a model definition
 * - are able to fetch via persistance adapter
 *
 * Example:
 *
 * var c = new Collection({
 *  model: dime.mode.Activity
 *  sort: function(a,b) { ... }
 * });
 *
 * @param {Object} options
 * @param {Array} data
 * @returns {Collection}
 */
dime.Collection = function(options, data) {
  if (!(this instanceof dime.Collection)) {
      return new dime.Collection(options, data);
  }

  this.config = _.extend({
    idAttribute: 'id'
  }, options || {});

  // Convert data to models
  if (data !== undefined && _.isArray(data)) {
    data.forEach(function (item) {
      this.add(item);
    }, this);
  }
};

dime.Collection.prototype = new Array();
dime.Collection.prototype.constructor = dime.Collection;

dime.Collection.prototype.add = function (data, idx) {
  if (data !== undefined && _.isObject(data)) {
    var item = data;
    if (this.config.model !== undefined && !(data instanceof this.config.model)) {
      item = this.config.model(data);
    }
    this.push(item);
  }
  return this;
};

dime.Collection.prototype.create = function (data) {
  var model = undefined;
  if (this.config.model !== undefined) {
    model = new this.config.model(data);
  }
  return model;
};

dime.Collection.prototype.filter = function (filter) {
  if (_.isUndefined(this.data)) {
    this.data = this;
  }
  this.data = _.filter(this.data, filter);
  return this;
};

dime.Collection.prototype.find = function (filter) {
  if (_.isNumber(filter)) {
    filter = {};
    filter[this.config.idAttribute] = filter;
  }
  return _.findWhere(this, filter);
};

dime.Collection.prototype.findAll = function () {
  return this.data;
};

dime.Collection.prototype.first = function () {
  return (this.length > 0) ? this[0] : undefined;
};

dime.Collection.prototype.last = function () {
  return (this.length > 0) ? this[this.length - 1] : undefined;
};

dime.Collection.prototype.remove = function (filter) {
  if (_.isNumber(filter)) {
    filter = {};
    filter[this.config.idAttribute] = filter;
  }
  this.data = _.reject(this, filter);
  return this;
};
