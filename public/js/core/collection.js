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
      item.parent(this);
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

  Collection.prototype.reset = function () {
    this.length = 0;
  };

  // REST API

  Collection.prototype.request = function (resource, data, options) {
    // Build url
    var url = [];
    if (dime.apiUrl && resource.indexOf(dime.apiUrl) === -1) {
      url.push(dime.apiUrl);
    }
    url.push(resource);

    // Build request configuration
    var configuration = { method: 'GET', initialValue: this };
    configuration.config = function (xhr) {
      xhr.withCredentials = true;
      dime.events.emit('request-config', {
        xhr: xhr,
        options: options
      });
    };
    configuration.extract = function (xhr, options) {
      dime.events.emit('request-extract', {
        xhr: xhr,
        options: options
      });

      if (xhr.status !== 200) {
        throw xhr.status;
      }
      return xhr.status !== 200 ? xhr.status : xhr.responseText;
    };

    // Extend configuration
    // TODO wrap extract
    if (_.isPlainObject(options)) {
      _.extend(configuration, options);
    }
    configuration.url = url.join('/');
    configuration.data = data;

    // Do request
    return m.request(configuration);
  };

  Collection.prototype.fetch = function (options) {
    var that = this;
    var replaceCollection = true;
    var url = this.config.url;
    if (options && options.url) {
      url = options.url;
      delete options.url;
      replaceCollection = false;
    }

    // TODO Paginate
    return this
            .request(url, {}, _.extend({}, options))
            .then(function (list) {
              if (replaceCollection) {
                that.reset();
              }

              list.forEach(function (item) {
                that.add(item);
              });
            });
  };

  Collection.prototype.persist = function (data, options) {
    var that = this,
        url = this.config.url,
        method = 'POST';

    if (data[this.config.idAttribute]) {
      url = this.config.url + '/' + data[this.config.idAttribute];
      method = 'PUT';
    }

    return this
            .request(url, data, _.extend({ method: method }, options))
            .then(function (response) {
              var result = response;
              if (method === 'POST') { // create new
                result = that.add(response);
              }
              return result;
            });
  };

  Collection.prototype.remove = function (data, options) {
    var that = this,
        url = this.config.url,
        method = 'DELETE';

    if (data[this.config.idAttribute]) {
      url = this.config.url + '/' + data[this.config.idAttribute];
    }

    return this
        .request(url, {}, _.extend({ method: method }, options))
        .then(function (response) {
          var idx = that.indexOf(data),
              item = data;
          if (-1 < idx) {
            item = that.splice(idx, 1);
          }
          return item;
        });
  };

})(dime, m, _);