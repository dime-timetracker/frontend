'use strict';

/**
 * resource.js
 *
 * TODO Offline support
 * TODO localStorage einbauen
 *
 * @param {object} options Resource configuration
 * @returns {Resource}
 */
var Resource = function (options) {
  var that = this;

  this.collection = [];
  this.config = _.extend({
    idAttribute: 'id',
    sorted: false,
    empty: {}
  }, options);

  this.extractResponse = function (xhr, options) {
    if (xhr.status != 200) {
      throw xhr.status;
    }
    return xhr.status != 200 ? xhr.status : xhr.responseText
  }
};

/**
 * Return the defined empty object
 * @param Object data
 * @returns Object
 */
Resource.prototype.empty = function (data) {
  return _.extend({}, this.config.empty, data || {});
};

Resource.prototype.first = function () {
  return (this.collection.length > 0) ? this.collection[0] : undefined;
};

Resource.prototype.last = function () {
  return (this.collection.length > 0) ? this.collection[this.collection.length - 1] : undefined;
};

Resource.prototype.find = function (filter) {
  if (_.isNumber(filter)) {
    filter = {};
    filter[this.idAttribute] = filter;
  }
  return _.findWhere(this.collection, filter);
};

Resource.prototype.findAll = function () {
  return this.collection;
};

Resource.prototype.fetch = function () {
  var that = this,
      deferred = m.deferred();

  m
  .request({ method: 'GET', url: this.config.url, config: function(xhr) {xhr.withCredentials = true;}, user: this.config.user, password: this.config.password })

  .then(function (list) {
    var c = _.isFunction(that.config.sort) ? list.sort(that.config.sort) : list;
//    that.collection = _.isFunction(that.config.sort) ? list.sort(that.config.sort) : list;
    if (_.isFunction(that.config.model)) {
      c.forEach(function (item, idx, collection) {
        collection[idx] = new that.config.model(item);
      });
    }

    that.collection = c;
    deferred.resolve(that.collection);

    deferred.promise(that.collection);
  })
  .then(null, function (httpStatus) {
    if (_.isFunction(that.config.fail(httpStatus))) {
      that.config.fail(httpStatus);
    }
    deferred.reject({httpStatus: httpStatus});
  });

  return deferred.promise;
};

Resource.prototype.persist = function (data) {
  var url = this.config.url,
      method = 'POST',
      that = this,
      deferred = m.deferred();

  if (data[this.config.idAttribute]) {
    url = this.config.url + '/' + data[this.config.idAttribute];
    method = 'PUT';
  }

  m
  .request({ method: method, url: url, data: data, extract: that.extractResponse })
  .then(function (response) {
    if (method === 'POST') { // create new
      if (_.isFunction(that.config.model)) {
        response = new that.config.model(response);
      }
      that.collection.push(response);
      if (_.isFunction(that.config.sort)) {
        that.collection = that.collection.sort(that.config.sort);
      }
    }
    deferred.resolve(response);
    return response;
  })
  .then(null, function (httpStatus) {
    if (_.isFunction(that.config.fail(httpStatus))) {
      that.config.fail(httpStatus);
    }
    deferred.reject({httpStatus: httpStatus});
  });

  deferred.promise(data);
  return deferred.promise;
};

Resource.prototype.remove = function (data) {
  var url = this.config.url,
      method = 'DELETE',
      that = this,
      deferred = m.deferred(),
      id = data[this.config.idAttribute];

  if (id) {
    url = this.config.url + '/' + id;

    m
    .request({ method: method, url: url, extract: that.extractResponse })
    .then(function (response) {
      var idx = that.collection.indexOf(data),
              item = data;
      if (-1 < idx) {
        item = that.collection.splice(idx, 1);
      }
      deferred.resolve(item);
      return item;
    })
    .then(null, function (httpStatus) {
      if (_.isFunction(that.config.fail(httpStatus))) {
        that.config.fail(httpStatus);
      }
      deferred.reject({httpStatus: httpStatus});

    });
    deferred.promise({});
  } else {
    deferred.reject();
  }
  return deferred.promise;
};
