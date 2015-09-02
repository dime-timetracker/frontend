'use strict';

var create = require('lodash/object/create');
var extend = require('lodash/object/extend');
var isArray = require('lodash/lang/isArray');

var _ = require('lodash');
var qsort = require('./helper/qsort');
var naturalCompare = require('./helper/compare/natural');
var objectKey = require('./helper/compare/objectKey');
var baseUrl = require('./helper/baseUrl');
var buildUrl = require('./helper/buildUrl');
var extractXhrPagination = require('./helper/extractXhrPagination');
var debug = global.window.dimeDebug('collection');

var m = require('mithril');
var authorize = require('./authorize');

/**
* Collection is a array of objects.
*
* - can find objects by identifier
* - can find objects by property
* - can filter into new Collection
* - can be ordered
* - can have a model definition
* - can fetch, persist and remove via m.request
*
* Options:
*
* {
*   model: Constructor.function,
*   compare: compareFunction,         // default: naturalCompare
*   compareKey: comparekeyFunction    // default: compareKey (obj.name || obj.alias || obj.id)
*
*   resourceUrl: 'RESOURCE-NAME',
*   requestAttributes: {
*     page: 1,
*     with: 50
*   },
*   idAttribure: 'id'
* }
*
*
* Example:
*
* var c = new Collection({
*  model: Activity,
*
* });
*
* @param {Object} options
* @param {Array} data
* @returns {Collection}
*/
var Collection = function (options, data) {
  if (!(this instanceof Collection)) {
    return new Collection(options, data);
  }

  this.config = extend({
    compare: naturalCompare,
    compareKey: objectKey,
    idAttribute: 'id',
    requestAttributes: {}
  }, options);

  // Convert data to models
  if (isArray(data)) {
    data.forEach(function (item) {
      this.add(item);
    }, this);

    this.order();
  }
};

Collection.prototype = create(Array.prototype, {
  constructor: Collection
});

/**
 * Change or replace the configuration of a collection.
 *
 * Example:
 *
 *   * collection.configure('idAttribute', 'alias') => Collection
 *   * collection.configure({'idAttribute': 'alias'}) => Collection
 *
 * @param {string|object} name
 * @param {string} value Value
 * @returns {Collection}
 */
Collection.prototype.configure = function (name, value) {
  if (!_.isUndefined(name)) {
    if (_.isPlainObject(name)) {
      this.config = extend(this.config, name);
    } else {
      this.config[name] = value;
    }
  }
  return this;
};

// Array functions

/**
 * Add data object to collection. The data object will go
 * thru the Collection.create method to ensure the model.
 *
 * @param {object} data plain data object
 * @returns {collection}
 */
Collection.prototype.add = function (data) {
  var item = data;
  if (data !== undefined && _.isObject(data)) {
    item = this.modelize(data);
    this.push(item);
  }
  return this;
};

/**
 * Filter collection data and create a new cloned collection.
 *
 * @param {object} filter
 * @returns {Collection} cloned collection with filtered data
 */
Collection.prototype.filter = function (filter) {
  return new Collection(this.config, _.filter(this, filter));
};

/**
 * Find a model in collection.
 *
 * @param {object} data object data to search for
 * @returns {object} model object
 */
Collection.prototype.find = function (data) {
  var result;
  if (_.isPlainObject(data)) {
    result = _.findWhere(this, data);
  } else if (_.isFunction(data)) {
    result = _.find(this, data);
  } else {
    var filter = {};
    filter[this.config.idAttribute] = data;
    result = _.findWhere(this, filter);
  }
  return result;
};

/**
 * Get first item of collection.
 *
 * @returns {object} model object or undefined if collection empty
 */
Collection.prototype.first = function () {
  return (this.length > 0) ? this[0] : undefined;
};

/**
 * Get last item of collection,
 *
 * @returns {object} model object or undefined if collection empty
 */
Collection.prototype.last = function () {
  return (this.length > 0) ? this[this.length - 1] : undefined;
};

/**
 * Create a new model object out of the plain data object. It uses
 * the model function defined in configuration. The new model will
 * not added to the collection.
 *
 * @param {object} data plain data object
 * @returns {Model} Model object if model function defined
 */
Collection.prototype.modelize = function (data) {
  var model = data || {};
  if (this.config.model !== undefined && !(data instanceof this.config.model)) {
    model = new this.config.model(data);
  }
  return model;
};

/**
 * Return the total count of item, the api can deliver.
 *
 * @returns {Number}
 */
Collection.prototype.total = function () {
  return (this.pagination && this.pagination.total) ? this.pagination.total : 0;
};

/**
 * The api can offer more items then the collection contains.
 *
 * @return {Boolean} can fetch more
 */
Collection.prototype.hasMore = function () {
  return this.length < this.total();
};

/**
 * Get the real data array without configuration.
 *
 * @returns {Array}
 */
Collection.prototype.toArray = function () {
  var array = [];
  this.forEach(function (item) {
    array.push(item);
  });
  return array;
};

/**
 * Sort collection by key and compare functions. Without parameter the
 * config.compare and config.compareKey will be used. The sort will be
 * internal and create not a clone.
 *
 * @param {function} key = function (obj) { return obj.key };
 * @param {function} compare = function (a, b) { return 1 || 0 || -1; };
 * @returns {Collection} this
 */
Collection.prototype.order = function (key, compare) {
  if (!_.isFunction(key)) {
    key = this.config.compareKey;
  }

  if (!_.isFunction(compare)) {
    compare = this.config.compare;
  }

  if (this.length > 0 && _.isFunction(key) && _.isFunction(compare)) {
    qsort(compare, key, this);
  }

  return this;
};

/**
 * Search for data object and remove it from collection.
 *
 * @param {object} data object you wanne remove.
 * @returns {object} data object
 */
Collection.prototype.removeFromCollection = function (data) {
  var idx = this.indexOf(data);
  if (-1 < idx) {
    this.splice(idx, 1);
  }
  return data;
};

/**
 * Remove everything from collection.
 * @returns {Collection} this
 */
Collection.prototype.reset = function () {
  while (this.length) {
    this.shift();
  }
  return this;
};

// REST API functions

/**
 * Initialize the collection and fetches the first set of data.
 *
 * requestAttributes:
 *   page - Define the start page
 *   with - Define the amount of result items
 *   filter - Define a filter query
 *
 * Example:
 *   // Response should have all items the api can deliver
 *   Collection.initialize() => m.request
 *
 *   // Response should be the first 100 items
 *   Collection.initialize({
 *   	page: 1,
 *   	with: 100
 *   }) => m.request
 *
 * @param {Object} requestAttributes
 * @return {m.request} promise of the m.request
 */
Collection.prototype.initialize = function (requestAttributes) {
  var that = this;

  // Build request uri
  var url = buildUrl(['api', this.config.resourceUrl], _.extend(
    {},
    this.config.requestAttributes,
    requestAttributes
  ));

  return m
    .request({
      method: 'GET',
      url: url,
      initialValue: this,
      config: function (xhr) {
        authorize.setup(xhr);
      },
      extract: function (xhr) {
        that.pagination = extractXhrPagination(xhr);
        return xhr.responseText;
      }
    })
    .then(function success (list) {
      that.reset();

      list.forEach(function (item) {
        that.add(item);
      });

      that.order();
    }, function error(response) {
      if (_.isPlainObject(response) && response.error) {
        // TODO Notify
        if (console) {
          console.log(response);
        }
      }
    });
};

/**
 * Fetch next set of data from api. If no more data because of
 * length >= total then an empty promise will deliver.
 *
 * Example:
 *   * collection.fetchNext() => m.request
 *
 * @returns {m.request} promise of the m.request
 */
Collection.prototype.fetchNext = function () {
  var that = this;

  if (!this.hasMore()) {
    var deferred = m.deferred();
    deferred.resolve({});
    return deferred.promise;
  }

  return m
    .request({
      method: 'GET',
      url: baseUrl(this.pagination.next),
      initialValue: this,
      config: function (xhr) {
        authorize.setup(xhr);
      },
      extract: function (xhr) {
        that.pagination = extractXhrPagination(xhr);
        return xhr.responseText;
      }
    })
    .then(function success (list) {
      list.forEach(function (item) {
        that.add(item);
      });

      that.order();
    }, function error(response) {
      if (_.isPlainObject(response) && response.error) {
        // TODO Notify
        if (console) {
          console.log(response);
        }
      }
    });
};

/**
 * Send POST or PUT to api.
 *
 * @param {Object} data
 * @returns {m.request} Promise of the m.request
 */
Collection.prototype.persist = function (data) {
  var that = this;
  _.forOwn(data, function (item, key) {
    if (item instanceof Collection) {
      data[key] = item.toArray();
    }
  });

  // Request configuration
  var configuration = {
    method: 'POST',
    url: baseUrl('api', this.config.resourceUrl),
    initialValue: data,
    data: data,
    config: function (xhr) {
      authorize.setup(xhr);
    }
  };

  // Look for the identifer
  if (data[this.config.idAttribute]) {
    configuration.url = baseUrl(configuration.url, data[this.config.idAttribute]);
    configuration.method = 'PUT';
  }

  return m
    .request(configuration)
    .then(function success(response) {
      var result = response;
      if (configuration.method === 'POST') { // create new
        that.removeFromCollection(data);
        result = that.add(response);
      }
      that.order();
      return result;
    }, function error(response) {
      if (_.isPlainObject(response) && response.error) {
        if (console) {
          console.log(response);
        }
      }
    });
};

/**
 * Send DELETE to api.
 *
 * @param {Object} data
 * @returns {m.request} Promise of the m.request
 */
Collection.prototype.remove = function (data) {
  var that = this;
  var configuration = {
    method: 'DELETE',
    url: baseUrl('api', this.config.resourceUrl),
    initialValue: data,
    config: function (xhr) {
      authorize.setup(xhr);
    }
  };

  if (data[this.config.idAttribute]) {
    configuration.url = baseUrl(configuration.url, data[this.config.idAttribute]);
    return m
      .request(configuration)
      .then(function success() {
        return that.removeFromCollection(data);
      }, function error(response) {
        if (_.isPlainObject(response) && response.error) {
          if (console) {
            console.log(response);
          }
        }
      });
  } else {
    this.removeFromCollection(data);
  }
};

module.exports = Collection;
