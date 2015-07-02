'use strict';

module.exports = function (obj) {
  var customer = obj._text.match(/\B@([a-z0-9\-\/\_+]+)\b/i);
  if (null !== customer) {
    obj.customer = {
      alias: customer[1]
    };
    obj._text = obj._text.replace('@' + customer[1], '', 'g');
  }
  return obj;
}
