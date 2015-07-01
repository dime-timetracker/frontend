'use strict';

var _ = require('lodash');
var qsort = require('./helper/qsort');
var naturalCompare = require('./helper/compare/natural');
var objectKey = require('./helper/compare/objectKey');

var m = require('mithril');
var authorize = require('./authorize');
var helper = require('./helper');

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

  this.config = _.extend({
    compare: naturalCompare,
    compareKey: objectKey,
    idAttribute: 'id',
    requestAttributes: {}
  }, options || {});

  // Convert data to models
  if (data !== undefined && _.isArray(data)) {
    data.forEach(function (item) {
      this.add(item);
    }, this);

    this.order();
  }
};

Collection.prototype = new Array();
Collection.prototype.constructor = Collection;

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
      this.config = _.extend(this.config, name);
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
  var filter;
  if (_.isPlainObject(data)) {
    filter = data;
  } else {
    filter = {};
    filter[this.config.idAttribute] = data;
  }
  return _.findWhere(this, filter);
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
    delete this[0];
  }
  this.length = 0;
  return this;
};

// REST API functions

/**
 * Fetch data from api.
 *
 * Example:
 *   * collection.fetch() => m.request  // (will fetch the next from the api)
 *   * collection.fetch({
 *      requestAttributes: {
 *        page: 1,
 *        with: 50,
 *        filter: ...
 *      },
 *      reset: true
 *   }) => m.request  // (remove all items from collecten and fetch the first 50 items from the api)
 *
 * @param {object} options
 * @returns {m.request} promise of the m.request
 */
Collection.prototype.fetch = function (options) {
  var that = this;
  var reset = false;

  // Request configuration
  var configuration = {
    method: 'GET',
    url: helper.baseUrl('api', this.config.resourceUrl),
    initialValue: this,
    config: function (xhr) {
      authorize.setup(xhr);
    },
    extract: function (xhr, xhrOptions) {
      that.pagination = {};

      // extract total number
      that.pagination.total = parseInt(xhr.getResponseHeader('X-Dime-Total') || 0);

      // extract pagination links
      if (xhr.getResponseHeader('Link')) {
        var uri = xhr.getResponseHeader('Link').split(', ');
        uri.forEach(function (link) {
          var m = link.match(/<(.*)>; rel="(.*)"/);
          that.pagination[m[2]] = m[1];
        }, this);
      }
      return xhr.responseText;
    }
  };

  // Configure the request via option parameter
  if (_.isPlainObject(options)) {
    if (!_.isUndefined(options.reset)) {
      reset = options.reset;
    }

    // Modify resource url with pagination
    var requestAttributes = _.extends({}, this.config.requestAttributes, options.requestAttributes || {});
    if (!_.isEmpty(requestAttributes)) {
      configuration.url = helper.buildUrl(configuration.url, requestAttributes);
    }
  } else {
    // If paginage exists and has next url, use it
    if (this.pagination && this.pagination.next) {
      configuration.url = helper.baseUrl(this.pagination.next);
    }
  }

  return m
    .request(configuration)
    .then(function success (list) {
      if (reset) {
        that.reset();
      }

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
    url: helper.baseUrl('api', this.config.resourceUrl),
    initialValue: data,
    data: data,
    config: function (xhr) {
      authorize.setup(xhr);
    }
  };

  // Look for the identifer
  if (data[this.config.idAttribute]) {
    configuration.url = helper.baseUrl(configuration.url, data[this.config.idAttribute]);
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
    url: helper.baseUrl('api', this.config.resourceUrl),
    initialValue: data,
    config: function (xhr) {
      authorize.setup(xhr);
    }
  };

  if (data[this.config.idAttribute]) {
    configuration.url = helper.baseUrl(configuration.url, data[this.config.idAttribute]);
  }

  return m
    .request(configuration)
    .then(function success (response) {
      return that.removeFromCollection(data);
    }, function error (response) {
      if (_.isPlainObject(response) && response.error) {
        if (console) {
          console.log(response);
        }
      }
    });
};

module.exports = Collection;