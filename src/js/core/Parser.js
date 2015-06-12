/* global module */

'use strict';

var _ = require('lodash');

var Parser = function (options) {
  if (!(this instanceof Parser)) {
    return new Parser();
  }
  _.extend(this, {}, options);
  this._order = [];
};

Parser.prototype = new Object();
Parser.prototype.constructor = Parser;

Parser.prototype.register = function(name, func) {
  this[name] = func;
  if (-1 === this._order.indexOf(name)) {
    this._order.push(name);
  }
};

Parser.prototype.parse = function (text, order) {
  order = order || this._order;
  var result = { _text: text };

  for (var i = 0; i < order.length; i++) {
    if (_.isFunction(this[order[i]])) {
      this[order[i]](result);
    }
  }

  delete result._text;
  return result;
};

module.exports = Parser;