;(function (dime, m) {
  'use strict';

  /**
   * Model
   *
   * - extends json data with prototype function
   * - connected to persistence adapter
   * - are part of an collection
   *
   */
  var Model = function () {
    if (!(this instanceof Model)) {
      return new Model();
    }
  };

  Model.prototype = new Object();
  Model.prototype.constructor = Model;
  Model.prototype.parent = m.prop('parent');

  dime.Model = Model;
})(dime, m);