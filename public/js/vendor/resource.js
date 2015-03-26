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

    this.config = _.extend({
        idAttribute: 'id',
        sorted: false,
        empty: {}
    }, options);
    this.collection = [];

    m.request({ method: 'GET', url: this.config.url })
    .then(function (list) {
        that.collection = _.isFunction(that.config.sort) ? list.sort(that.config.sort) : list;
        if (_.isFunction(that.config.model)) {
          that.collection.forEach(function(item, idx, collection) {
            collection[idx] = new that.config.model(item);
          });
        }
        return that.collection;
    });
};

Resource.prototype.empty = function (data) {
    data = data || {};
    return _.extend({}, this.config.empty, data);
};

Resource.prototype.first = function () {
    return (this.collection.length > 0) ? this.collection[0] : undefined;
};

Resource.prototype.last = function () {
    return (this.collection.length > 0) ? this.collection[this.collection.length - 1] : undefined;
};

Resource.prototype.find = function (id) {
    var result = this.collection.find(function(item) {
        return item.id === id;
    });
    if (!result) {
        result = this.empty();
    }
    return result;
};

Resource.prototype.findAll = function () {
    return this.collection;
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

    m.request({ method: method, url: url, data: data })
    .then(function(response) {
        if (method === 'POST') {
            that.collection.push(response);
            if (_.isFunction(that.config.sort)) {
                that.collection = that.collection.sort(that.config.sort);
            }
        }
        deferred.resolve(response);
        return response;
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

        m.request({ method: method, url: url })
        .then(function(response) {
            var idx = that.indexOf(data),
                item = data;
            if (-1 < idx) {
                item = that.collection.splice(idx, 1);
            }
            deferred.resolve(item);
            return item;

        });
        deferred.promise({});
    } else {
        deferred.reject();
    }
    return deferred.promise;
};
