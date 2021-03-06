'use strict'

const Store = function () {
  if (!(this instanceof Store)) {
    return new Store()
  }
}

Store.prototype = Object.create(null)
Store.prototype.constructor = Store

Store.prototype.getItem = function (key) {
  return (this[key] !== undefined) ? this[key] : undefined
}

Store.prototype.setItem = function (key, value) {
  this[key] = value
}

Store.prototype.removeItem = function (key) {
  if (this[key] !== undefined) {
    delete this[key]
  }
}

Store.prototype.clear = function (key) {
  for (var name in this) {
    if (this.hasOwnProperty(name)) {
      delete this[name]
    }
  }
}

module.exports = (global.window && global.window.localStorage) ? global.window.localStorage : new Store()
