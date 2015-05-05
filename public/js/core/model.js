/*
 * Model
 *
 * - extends json data with prototype function
 * - connected to persistence adapter
 * - are part of an collection
 * 
 */

dime.Model = function() {
  if (!(this instanceof dime.Model)) {
      return new dime.Model();
  }
};


dime.Model.prototype = new Object();
dime.Model.prototype.constructor = dime.Model;

dime.Model.prototype.parent = m.prop('parent');