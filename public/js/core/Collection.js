;(function (dime, m, _) {
  'use strict';

  var qsort = function (compare, key, array, left, right) {
    left = left || 0;
    right = right || array.length - 1;
    var i = left;
    var j = right;
    var tmp;
    var pivotidx = (left + right) / 2;
    var pivot = key(array[pivotidx.toFixed()]);
    /* partition */
    while (i <= j) {
      while (compare(key(array[i]), pivot) === -1) {
        i++;
      }
      while (compare(key(array[j]), pivot) === 1) {
        j--;
      }
      if (i <= j) {
        tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
        i++;
        j--;
      }
    }

    /* recursion */
    if (left < j) {
      qsort(compare, key, array, left, j);
    }
    if (i < right) {
      qsort(compare, key, array, i, right);
    }
  };

  var naturalCompare = function (left, right) {
    for (var x = 0, aa, bb; (aa = left[x]) && (bb = right[x]); x++) {
        aa = aa.toLowerCase();
        bb = bb.toLowerCase();
        if (aa !== bb) {
          var c = Number(aa), d = Number(bb);
          if (c == aa && d == bb) {
            return c - d;
          } else {
            return (aa > bb) ? 1 : -1;
          }
      }
    }
    return left.length - right.length;
  };

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
  *   resourceUrl: 'RESOURCE-NAME',
  *   idAttribure: 'id',
  *   model: Constructor.function,
  *   compare: compareFunction,         // default: naturalCompare
  *   compareKey: comparekeyFunction    // default: compareKey (obj.name || obj.alias || obj.id)
  * }
  *
  *
  * Example:
  *
  * var c = new Collection({
  *  model: dime.mode.Activity,
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
      idAttribute: 'id',
      compare: naturalCompare,
      compareKey: function (obj) {
        var result = undefined;
        if (!_.isUndefined(obj)) {
          result = obj.name || obj.alias || obj.id;
        }
        return result;
      }
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

  dime.Collection = Collection;

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

  // Array

  Collection.prototype.add = function (data) {
    var item = data;
    if (data !== undefined && _.isObject(data)) {
      item = this.create(data);
      this.push(item);
    }
    return item;
  };

  Collection.prototype.create = function (data) {
    var model = data;
    if (this.config.model !== undefined && !(data instanceof this.config.model)) {
      model = new this.config.model(data);
    }
    return model;
  };

  Collection.prototype.filter = function (filter) {
    return new Collection(this.config, _.filter(this, filter));
  };

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

  Collection.prototype.first = function () {
    return (this.length > 0) ? this[0] : undefined;
  };

  Collection.prototype.last = function () {
    return (this.length > 0) ? this[this.length - 1] : undefined;
  };

  Collection.prototype.toArray = function () {
    var array = [];
    this.forEach(function (item) {
      array.push(item);
    });
    return array;
  };

  /**
   * Sort collection by key and compare functions. Without parameter the
   * config.compare and config.compareKey will be used.
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
   * Search for data object and remove it from Collection.
   * 
   * @param {object} data
   * @returns {object}
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

  // REST API
  Collection.prototype.fetch = function (options) {
    var that = this;
    var reset = true;
    var configuration = {
      method: 'GET',
      url: dime.helper.format.url('api', this.config.resourceUrl),
      initialValue: this,
      config: function (xhr) {
        dime.events.emit('authorize', xhr);
      },
      extract: function (xhr, xhrOptions) {
        that.pager = new dime.Pager(that, xhr);
        return xhr.responseText;
      }
    };

    if (_.isPlainObject(options)) {
      if (!_.isUndefined(options.resourceUrl)) {
        configuration.url = dime.helper.format.url(options.resourceUrl);
      }
      if (!_.isUndefined(options.reset)) {
        reset = options.reset;
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
          if (console) {
            console.log(response);
          }
        }
      });
  };

  Collection.prototype.persist = function (data, options) {
    var that = this;
    _.forOwn(data, function (item, key) {
      if (item instanceof Collection) {
        data[key] = item.toArray();
      }
    })
    var configuration = {
      method: 'POST',
      url: dime.helper.format.url('api', this.config.resourceUrl),
      initialValue: data,
      data: data,
      config: function (xhr) {
        dime.events.emit('authorize', xhr);
      }
    };

    if (data[this.config.idAttribute]) {
      configuration.url = dime.helper.format.url(configuration.url, data[this.config.idAttribute]);
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

  Collection.prototype.remove = function (data, options) {
    var that = this;
    var configuration = {
      method: 'DELETE',
      url: dime.helper.format.url('api', this.config.resourceUrl),
      initialValue: data,
      config: function (xhr) {
        dime.events.emit('authorize', xhr);
      }
    };

    if (data[this.config.idAttribute]) {
      configuration.url = dime.helper.format.url(configuration.url, data[this.config.idAttribute]);
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

})(dime, m, _);
