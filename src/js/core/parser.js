'use strict';

var _ = require('lodash');

var parsers = {};
var defaultOrder = [];

function register (name, func) {
  parsers[name] = func;
  if (-1 === defaultOrder.indexOf(name)) {
    defaultOrder.push(name);
  }
}

function parse (text, order) {
  order = order || defaultOrder;
  var result = { _text: text };

  var i;
  for (i = 0; i < order.length; i++) {
    if (_.isFunction(parsers[order[i]])) {
      parsers[order[i]](result);
    }
  }

  delete result._text;
  return result;
}

register('customer', require('./parser/customer'));

module.exports = {
  register: register,
  parse: parse
};
