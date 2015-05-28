;(function (dime) {
  'use strict';
  /**
   * Pager object to navigate to next page.
   *
   * - read header X-Dime-Total
   * - read header Link
   * - create rel functions [next, prev, first, last]
   * - hasMore
   *
   * @param {dime.Collection} collection
   * @param {type} xhr
   * @returns {dime.Pager}
   */
  var Pager = function (collection, xhr) {
    if (!(this instanceof Pager)) {
      return new Pager(collection, xhr);
    }

    this.collection = collection;
    this.total = parseInt(xhr.getResponseHeader('X-Dime-Total') || 0);
    this.pagination = {};

    if (xhr.getResponseHeader('Link')) {
      var uri = xhr.getResponseHeader('Link').split(', ');
      uri.forEach(function (link) {
        var m = link.match(/<(.*)>; rel="(.*)"/);
        this.pagination[m[2]] = m[1];
      }, this);
    }
  };

  Pager.prototype = new Object();
  Pager.prototype.constructor = Pager;

  Pager.prototype.next = function () {
    this.collection.fetch({ url: this.pagination.next, reset: false });
  };

  Pager.prototype.previous = function () {
    this.collection.fetch({ url: this.pagination.previous, reset: false });
  };

  Pager.prototype.first = function () {
    this.collection.fetch({ url: this.pagination.first, reset: true });
  };

  Pager.prototype.last = function () {
    this.collection.fetch({ url: this.pagination.last, reset: true });
  };

  /**
   * Check if collection length is smaller than X-Dime-Total
   * @returns {Boolean}
   */
  Pager.prototype.hasMore = function () {
    var result = false;
    if (this.collection.length > 0 && this.total > 0) {
      result = this.collection.length < this.total;
    }
    return result;
  };

  dime.Pager = Pager;

})(dime);