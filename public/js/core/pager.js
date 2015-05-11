;(function (dime) {
  'use strict';

  /**
   * Pager object to navigate to next page.
   *
   * - read header X-Dime-Total
   * - read header X-Dime-Link
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
    var uri = xhr.getResponseHeader('X-Dime-Link').split(', ');
    uri.forEach(function (link) {
      var url = link.split('; ')[0];
      var rel = link.match(/ rel="?(.+)"?$/)[1];
      this.pagination[rel] = url;
    }, this);
  };

  Pager.prototype = new Object();
  Pager.prototype.constructor = Pager;
  
  dime.Pager = Pager;

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
  
})(dime);