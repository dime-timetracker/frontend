;(function (dime, m) {
  'use strict';

  var Parser = function (data) {
    if (!(this instanceof Parser)) {
      return new Parser();
    }

    if (_.isArray(data)) {
      data.forEach(function (item) {
        this.push(item);
      }, this);
    }
  };

  Parser.prototype = new Array();
  Parser.prototype.constructor = Parser;

  dime.Parser = Parser;

  Parser.prototype.parse = function (text) {
    var result = { _text: text };
    this.forEach(function (value) {
      if (_.isFunction(value)) {
        value(result);
      }
    });
    delete result._text;
    return result;
  };
})(dime, m);