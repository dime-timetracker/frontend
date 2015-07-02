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

  if (result._text) {
    delete result._text;
  }
  return result;
}

register('customer', require('./parser/customer'));
register('project', require('./parser/project'));
register('service', require('./parser/service'));
register('tags', require('./parser/tags'));
register('times', require('./parser/times'));
register('filterTimes', require('./parser/filterTimes'));
register('description', require('./parser/description'));

module.exports = {
  register: register,
  parse: parse
};
