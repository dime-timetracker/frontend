;(function (dime, m, _) {
  'use strict';

  /**
  * Collection is a array of objects.
  *
  * - can find objects by identifier
  * - can find objects by parameter
  * - can filter into new Collection
  * - can have a model definition
  * - can fetch, persist and remove via m.request
  *
  * Example:
  *
  * var c = new Collection({
  *  model: dime.mode.Activity
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
  Collection.prototype.parent = m.prop('parent');

  dime.Collection = Collection;

  Collection.prototype.configure = function (name, value) {
    if (!_.isUndefined(name)) {
      if (_.isObject(name)) {
        this.config = _.extend(this.config, name);
      } else {
        this.config[name] = value;
      }
    }
    return this;
  };

  // Array

  Collection.prototype.add = function (data) {
    if (data !== undefined && _.isObject(data)) {
      var item = this.create(data);
      if (item.parent) {
        if (item.parent() !== this) {
          item.parent(this);
          this.push(item);
        }
      } else {
        this.push(item);
      }
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
    if (_.isNumber(data)) {
      data = {};
      data[this.config.idAttribute] = data;
    }
    return _.findWhere(this, data);
  };

  Collection.prototype.first = function () {
    return (this.length > 0) ? this[0] : undefined;
  };

  Collection.prototype.last = function () {
    return (this.length > 0) ? this[this.length - 1] : undefined;
  };

  Collection.prototype.order = function (func) {
    var data = this;
    if (_.isFunction(func)) {
      data = new Collection(this.config, this.sort(func));
    } else if (_.isFunction(this.config.sort)) {
      data = new Collection(this.config, this.sort(this.config.sort));
    }
    return data;
  };

  Collection.prototype.reset = function () {
    this.length = 0;
  };

  // REST API
  Collection.prototype.fetch = function (options) {
    var that = this;
    var reset = true;
    var configuration = {
      method: 'GET',
      url: dime.helper.format.url('api', this.config.url),
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
      if (!_.isUndefined(options.url)) {
        configuration.url = urlFor(options.url);
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
    var configuration = {
      method: 'POST',
      url: dime.helper.format.url('api', this.config.url),
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
          result = that.add(response);
        }
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
      url: dime.helper.format.url('api', this.config.url),
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
        var idx = that.indexOf(data),
            item = data;
        if (-1 < idx) {
          item = that.splice(idx, 1);
        }
        return item;
      }, function error (response) {
        if (_.isPlainObject(response) && response.error) {
          if (console) {
            console.log(response);
          }
        }
      });
  };

})(dime, m, _);