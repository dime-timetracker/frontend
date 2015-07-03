'use strict';

var Store = function () {
  if (!this instanceof Store) {
    return new Store();
  }
};

Store.prototype = {};
Store.prototype.contructor = Store;

Store.prototype.getItem = function (key) {
  return (this[key] !== undefined) ? this[key] : undefined;
};

Store.prototype.setItem = function (key, value) {
  this[key] = value;
};

Store.prototype.removeItem = function (key) {
  if (this[key] !== undefined) {
    delete this[key];
  }
};

Store.prototype.clear = function (key) {
  for (var name in this) {
    if (this.hasOwnProperty(name)) {
      delete this[name];
    }
  }
};

module.export = global.window.localStorage || new Store();


