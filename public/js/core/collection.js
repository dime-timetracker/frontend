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
var Collection = function(options, data) {
  if (!(this instanceof Collection)) {
      return new Collection(options, data);
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

Collection.prototype = new Array();
Collection.prototype.constructor = Collection;

Collection.prototype.add = function (data, idx) {
  if (data !== undefined && _.isObject(data)) {
    var item = data;
    if (this.config.model !== undefined && !(data instanceof this.config.model)) {
      item = this.config.model(data);
    }
    this.push(item);
  }
  return this;
};

Collection.prototype.create = function (data) {
  var model = undefined;
  if (this.config.model !== undefined) {
    model = new this.config.model(data);
  }
  return model;
};

Collection.prototype.find = function (filter) {
  if (_.isNumber(filter)) {
    filter = {};
    filter[this.config.idAttribute] = filter;
  }
  return _.findWhere(this, filter);
};

Collection.prototype.findAll = function () {
  return this.data;
};

Collection.prototype.first = function () {
  return (this.length > 0) ? this[0] : undefined;
};

Collection.prototype.last = function () {
  return (this.length > 0) ? this[this.length - 1] : undefined;
};


Collection.prototype.remove = function (filter) {
  if (_.isNumber(filter)) {
    filter = {};
    filter[this.config.idAttribute] = filter;
  }
  this.data = _.reject(this, filter);
  return this;
};
